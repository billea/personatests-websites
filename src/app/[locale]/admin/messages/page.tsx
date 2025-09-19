"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';
import { useAuth } from '@/components/providers/auth-provider';
import {
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  ContactMessage
} from '@/lib/firestore';

export default function AdminMessagesPage() {
  const { t, currentLanguage } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'resolved'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'technical' | 'feedback' | 'partnership'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      loadMessages();
    }
  }, [user, authLoading]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const allMessages = await getAllContactMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId: string, status: ContactMessage['status'], notes?: string) => {
    try {
      setIsUpdating(true);
      await updateContactMessageStatus(messageId, status, notes);
      await loadMessages(); // Reload messages
      setSelectedMessage(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating message status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm(t('admin.messages.confirm_delete') || 'Are you sure you want to delete this message?')) {
      try {
        await deleteContactMessage(messageId);
        await loadMessages(); // Reload messages
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    const matchesSearch = searchTerm === '' ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: ContactMessage['category']) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'feedback': return 'bg-green-100 text-green-800';
      case 'partnership': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Please sign in to access admin features.</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.messages.title') || 'Contact Messages'}
          </h1>
          <p className="text-gray-600">
            {t('admin.messages.subtitle') || 'Manage and respond to user inquiries'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.messages.search') || 'Search'}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.messages.search_placeholder') || 'Search messages...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.messages.status') || 'Status'}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t('admin.messages.all_statuses') || 'All Statuses'}</option>
                <option value="new">{t('admin.messages.new') || 'New'}</option>
                <option value="read">{t('admin.messages.read') || 'Read'}</option>
                <option value="resolved">{t('admin.messages.resolved') || 'Resolved'}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.messages.category') || 'Category'}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t('admin.messages.all_categories') || 'All Categories'}</option>
                <option value="general">{t('contact.form.category_general') || 'General Inquiry'}</option>
                <option value="technical">{t('contact.form.category_technical') || 'Technical Issue'}</option>
                <option value="feedback">{t('contact.form.category_feedback') || 'Feedback & Suggestions'}</option>
                <option value="partnership">{t('contact.form.category_partnership') || 'Partnership'}</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center">
              <div className="text-sm text-gray-600">
                {t('admin.messages.total') || 'Total'}: {messages.length}
              </div>
              <div className="text-sm text-gray-600">
                {t('admin.messages.filtered') || 'Filtered'}: {filteredMessages.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('admin.messages.messages_list') || 'Messages'}
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-600">
                  {t('admin.messages.loading') || 'Loading messages...'}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  {t('admin.messages.no_messages') || 'No messages found'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(message.category)}`}>
                            {message.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-600">{message.email}</div>
                      </div>

                      <div className="font-medium text-gray-900 mb-1">{message.subject}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('admin.messages.message_details') || 'Message Details'}
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  {/* Status and Category */}
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedMessage.category)}`}>
                      {selectedMessage.category}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <div className="font-medium text-gray-900">{selectedMessage.name}</div>
                    <div className="text-sm text-gray-600">{selectedMessage.email}</div>
                    {selectedMessage.userEmail && selectedMessage.userEmail !== selectedMessage.email && (
                      <div className="text-sm text-gray-500">User: {selectedMessage.userEmail}</div>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Subject</div>
                    <div className="text-gray-900">{selectedMessage.subject}</div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Message</div>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Admin Notes</div>
                    <textarea
                      value={adminNotes || selectedMessage.adminNotes || ''}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add admin notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      rows={3}
                    />
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Created: {formatDate(selectedMessage.createdAt)}</div>
                    {selectedMessage.readAt && (
                      <div>Read: {formatDate(selectedMessage.readAt)}</div>
                    )}
                    {selectedMessage.resolvedAt && (
                      <div>Resolved: {formatDate(selectedMessage.resolvedAt)}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    {selectedMessage.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id!, 'read', adminNotes)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
                      >
                        {isUpdating ? 'Updating...' : 'Mark as Read'}
                      </button>
                    )}

                    {(selectedMessage.status === 'new' || selectedMessage.status === 'read') && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id!, 'resolved', adminNotes)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        {isUpdating ? 'Updating...' : 'Mark as Resolved'}
                      </button>
                    )}

                    {adminNotes && adminNotes !== selectedMessage.adminNotes && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id!, selectedMessage.status, adminNotes)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        {isUpdating ? 'Updating...' : 'Save Notes'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id!)}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                {t('admin.messages.select_message') || 'Select a message to view details'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}