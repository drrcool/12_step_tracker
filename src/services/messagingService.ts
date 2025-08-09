import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  QuerySnapshot,
  Unsubscribe,
  writeBatch,
  arrayRemove,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {
  Message,
  Conversation,
  ConversationParticipant,
  MessageReaction,
} from '../types';

// Messaging Service
export const messagingService = {
  // Create a new conversation
  async createConversation(
    type: Conversation['type'],
    participantIds: string[],
    groupId?: string,
    metadata?: Conversation['metadata']
  ): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Ensure current user is included
    if (!participantIds.includes(auth.currentUser.uid)) {
      participantIds.push(auth.currentUser.uid);
    }

    const conversationRef = collection(db, 'conversations');
    const conversationDoc = await addDoc(conversationRef, {
      type,
      participantIds,
      groupId,
      metadata,
      lastActivity: serverTimestamp(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create participant records
    const batch = writeBatch(db);
    participantIds.forEach((userId) => {
      const participantRef = doc(collection(db, 'conversation_participants'));
      batch.set(participantRef, {
        conversationId: conversationDoc.id,
        userId,
        role: userId === auth.currentUser!.uid ? 'admin' : 'participant',
        joinedAt: serverTimestamp(),
        notificationsEnabled: true,
        status: 'active',
      });
    });

    await batch.commit();
    return conversationDoc.id;
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    replyToMessageId?: string
  ): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const batch = writeBatch(db);

    // Add message
    const messageRef = doc(collection(db, 'messages'));
    batch.set(messageRef, {
      senderId: auth.currentUser.uid,
      conversationId,
      content,
      type,
      status: 'sent',
      replyToMessageId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update conversation's last activity and message
    const conversationRef = doc(db, 'conversations', conversationId);
    batch.update(conversationRef, {
      lastMessage: {
        content,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        type,
      },
      lastActivity: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return messageRef.id;
  },

  // Get conversation messages with realtime updates
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void,
    limitCount = 50
  ): Unsubscribe {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message)).reverse(); // Reverse to show oldest first

      callback(messages);
    });
  },

  // Get user's conversations with realtime updates
  subscribeToConversations(
    callback: (conversations: Array<Conversation & { unreadCount?: number }>) => void
  ): Unsubscribe {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participantIds', 'array-contains', auth.currentUser.uid),
      where('isActive', '==', true),
      orderBy('lastActivity', 'desc')
    );

    return onSnapshot(q, async (querySnapshot: QuerySnapshot) => {
      const conversations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Conversation));

      // Calculate unread counts for each conversation
      const conversationsWithUnread = await Promise.all(
        conversations.map(async (conversation) => {
          const unreadCount = await this.getUnreadCount(conversation.id!);
          return { ...conversation, unreadCount };
        })
      );

      callback(conversationsWithUnread);
    });
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Update participant's lastReadAt
    const participantsRef = collection(db, 'conversation_participants');
    const q = query(
      participantsRef,
      where('conversationId', '==', conversationId),
      where('userId', '==', auth.currentUser.uid),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const participantDoc = querySnapshot.docs[0];
      await updateDoc(participantDoc.ref, {
        lastReadAt: serverTimestamp(),
      });
    }
  },

  // Get unread message count for a conversation
  async getUnreadCount(conversationId: string): Promise<number> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Get participant's last read timestamp
    const participantsRef = collection(db, 'conversation_participants');
    const participantQuery = query(
      participantsRef,
      where('conversationId', '==', conversationId),
      where('userId', '==', auth.currentUser.uid),
      limit(1)
    );

    const participantSnapshot = await getDocs(participantQuery);
    if (participantSnapshot.empty) return 0;

    const participant = participantSnapshot.docs[0].data() as ConversationParticipant;
    const lastReadAt = participant.lastReadAt;

    if (!lastReadAt) {
      // If never read, count all messages except user's own
      const messagesRef = collection(db, 'messages');
      const allMessagesQuery = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        where('senderId', '!=', auth.currentUser.uid)
      );
      const allMessagesSnapshot = await getDocs(allMessagesQuery);
      return allMessagesSnapshot.size;
    }

    // Count messages after last read
    const messagesRef = collection(db, 'messages');
    const unreadQuery = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      where('senderId', '!=', auth.currentUser.uid),
      where('createdAt', '>', lastReadAt)
    );

    const unreadSnapshot = await getDocs(unreadQuery);
    return unreadSnapshot.size;
  },

  // Start a direct conversation with another user
  async startDirectConversation(otherUserId: string): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Check if conversation already exists
    const existingConversations = await this.findDirectConversation(otherUserId);
    if (existingConversations.length > 0) {
      return existingConversations[0].id!;
    }

    // Create new conversation
    return this.createConversation('direct', [auth.currentUser.uid, otherUserId]);
  },

  // Find existing direct conversation between two users
  async findDirectConversation(otherUserId: string): Promise<Conversation[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('type', '==', 'direct'),
      where('participantIds', 'array-contains', auth.currentUser.uid),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Conversation));

    // Filter for conversations that include the other user
    return conversations.filter(conv =>
      conv.participantIds.includes(otherUserId) &&
      conv.participantIds.length === 2
    );
  },

  // Start a conversation with sponsor/sponsee
  async startSponsorConversation(sponsorId: string): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    return this.createConversation(
      'sponsor',
      [auth.currentUser.uid, sponsorId],
      undefined,
      {
        title: 'Sponsor Connection',
        description: 'Private conversation between sponsor and sponsee',
      }
    );
  },

  // Start a group conversation
  async startGroupConversation(groupId: string, title?: string): Promise<string> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Get group members
    const groupMembersRef = collection(db, 'group_memberships');
    const q = query(
      groupMembersRef,
      where('groupId', '==', groupId),
      where('status', '==', 'active')
    );

    const membersSnapshot = await getDocs(q);
    const participantIds = membersSnapshot.docs.map(doc => doc.data().userId as string);

    return this.createConversation(
      'group',
      participantIds,
      groupId,
      {
        title: title || 'Group Chat',
        description: 'Community group conversation',
      }
    );
  },

  // Add reaction to a message
  async addReaction(messageId: string, reaction: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const reactionsRef = collection(db, 'message_reactions');
    await addDoc(reactionsRef, {
      messageId,
      userId: auth.currentUser.uid,
      reaction,
      createdAt: serverTimestamp(),
    });
  },

  // Remove reaction from a message
  async removeReaction(messageId: string, reaction: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const reactionsRef = collection(db, 'message_reactions');
    const q = query(
      reactionsRef,
      where('messageId', '==', messageId),
      where('userId', '==', auth.currentUser.uid),
      where('reaction', '==', reaction),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
    }
  },

  // Get reactions for a message
  async getMessageReactions(messageId: string): Promise<Record<string, MessageReaction[]>> {
    const reactionsRef = collection(db, 'message_reactions');
    const q = query(
      reactionsRef,
      where('messageId', '==', messageId),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const reactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MessageReaction));

    // Group by reaction type
    return reactions.reduce((acc, reaction) => {
      if (!acc[reaction.reaction]) {
        acc[reaction.reaction] = [];
      }
      acc[reaction.reaction].push(reaction);
      return acc;
    }, {} as Record<string, MessageReaction[]>);
  },

  // Edit a message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);

    if (!messageSnap.exists()) throw new Error('Message not found');

    const message = messageSnap.data() as Message;
    if (message.senderId !== auth.currentUser.uid) {
      throw new Error('You can only edit your own messages');
    }

    await updateDoc(messageRef, {
      content: newContent,
      isEdited: true,
      editedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);

    if (!messageSnap.exists()) throw new Error('Message not found');

    const message = messageSnap.data() as Message;
    if (message.senderId !== auth.currentUser.uid) {
      throw new Error('You can only delete your own messages');
    }

    await deleteDoc(messageRef);
  },

  // Leave a conversation
  async leaveConversation(conversationId: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const batch = writeBatch(db);

    // Update participant status
    const participantsRef = collection(db, 'conversation_participants');
    const participantQuery = query(
      participantsRef,
      where('conversationId', '==', conversationId),
      where('userId', '==', auth.currentUser.uid),
      limit(1)
    );

    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      const participantDoc = participantSnapshot.docs[0];
      batch.update(participantDoc.ref, {
        status: 'inactive',
      });
    }

    // Remove user from conversation participants list
    const conversationRef = doc(db, 'conversations', conversationId);
    batch.update(conversationRef, {
      participantIds: arrayRemove(auth.currentUser.uid),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  },
};
