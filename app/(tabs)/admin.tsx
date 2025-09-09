import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Authority {
  id: string;
  name: string;
  address: string;
  type: 'Airport' | 'Hotel' | 'Monument' | 'Police Station' | 'Hospital';
  status: 'Active' | 'Inactive';
  addedDate: string;
  addedBy: string;
}

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showAddAuthorityModal, setShowAddAuthorityModal] = useState(false);
  const [newAuthority, setNewAuthority] = useState({
    name: '',
    address: '',
    type: 'Airport' as const,
  });

  // Mock data for demonstration
  const authorities: Authority[] = [
    {
      id: 'AUTH-001',
      name: 'Delhi Airport',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      type: 'Airport',
      status: 'Active',
      addedDate: '2024-01-10',
      addedBy: 'Admin'
    },
    {
      id: 'AUTH-002',
      name: 'Taj Hotel',
      address: '0x8ba1f109551bD432803012645Hac136c4c8c8c8c',
      type: 'Hotel',
      status: 'Active',
      addedDate: '2024-01-12',
      addedBy: 'Admin'
    },
    {
      id: 'AUTH-003',
      name: 'Red Fort',
      address: '0x9ca1f109551bD432803012645Hac136c4c8c8c8d',
      type: 'Monument',
      status: 'Active',
      addedDate: '2024-01-14',
      addedBy: 'Admin'
    },
    {
      id: 'AUTH-004',
      name: 'Mumbai Police Station',
      address: '0x1da1f109551bD432803012645Hac136c4c8c8c8e',
      type: 'Police Station',
      status: 'Inactive',
      addedDate: '2024-01-08',
      addedBy: 'Admin'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Airport': return 'airplane';
      case 'Hotel': return 'building.2.fill';
      case 'Monument': return 'building.columns.fill';
      case 'Police Station': return 'shield.fill';
      case 'Hospital': return 'cross.fill';
      default: return 'building.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Airport': return '#2196F3';
      case 'Hotel': return '#4CAF50';
      case 'Monument': return '#FF9800';
      case 'Police Station': return '#ff4444';
      case 'Hospital': return '#9C27B0';
      default: return '#666';
    }
  };

  const handleAddAuthority = () => {
    if (!newAuthority.name || !newAuthority.address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Here you would call your backend API
    Alert.alert('Success', 'Authority added successfully!');
    setShowAddAuthorityModal(false);
    setNewAuthority({ name: '', address: '', type: 'Airport' });
  };

  const handleRevokeAccess = (authorityId: string, authorityName: string) => {
    Alert.alert(
      'Revoke Access',
      `Are you sure you want to revoke access for ${authorityName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Revoke', 
          style: 'destructive',
          onPress: () => {
            // Here you would call your backend API
            Alert.alert('Success', 'Access revoked successfully!');
          }
        }
      ]
    );
  };

  const AuthorityRow = ({ authority }: { authority: Authority }) => (
    <ThemedView style={styles.authorityRow}>
      <View style={styles.authorityInfo}>
        <View style={styles.authorityHeader}>
          <View style={styles.authorityNameContainer}>
            <IconSymbol 
              name={getTypeIcon(authority.type)} 
              size={20} 
              color={getTypeColor(authority.type)} 
            />
            <ThemedText style={styles.authorityName}>{authority.name}</ThemedText>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: authority.status === 'Active' ? '#4CAF50' : '#9E9E9E' }
          ]}>
            <ThemedText style={styles.statusText}>{authority.status}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.authorityType}>{authority.type}</ThemedText>
        <ThemedText style={styles.authorityAddress} numberOfLines={1}>
          {authority.address}
        </ThemedText>
        <ThemedText style={styles.authorityDetails}>
          Added: {authority.addedDate} • By: {authority.addedBy}
        </ThemedText>
      </View>
      <TouchableOpacity 
        style={styles.revokeButton}
        onPress={() => handleRevokeAccess(authority.id, authority.name)}
      >
        <IconSymbol name="trash" size={18} color="#ff4444" />
      </TouchableOpacity>
    </ThemedView>
  );

  const authorityStats = {
    total: authorities.length,
    active: authorities.filter(a => a.status === 'Active').length,
    inactive: authorities.filter(a => a.status === 'Inactive').length,
    airports: authorities.filter(a => a.type === 'Airport').length,
    hotels: authorities.filter(a => a.type === 'Hotel').length,
    monuments: authorities.filter(a => a.type === 'Monument').length,
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>System Administration</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Monitor and manage the tourist safety system</ThemedText>
      </ThemedView>

      {/* Statistics */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Authority Statistics</ThemedText>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statNumber, { color: colors.tint }]}>
              {authorityStats.total}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Authorities</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statNumber, { color: '#4CAF50' }]}>
              {authorityStats.active}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Active</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statNumber, { color: '#9E9E9E' }]}>
              {authorityStats.inactive}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Inactive</ThemedText>
          </View>
        </View>
        
        <View style={styles.typeStats}>
          <View style={styles.typeStatItem}>
            <IconSymbol name="airplane" size={16} color="#2196F3" />
            <ThemedText style={styles.typeStatText}>Airports: {authorityStats.airports}</ThemedText>
          </View>
          <View style={styles.typeStatItem}>
            <IconSymbol name="building.2.fill" size={16} color="#4CAF50" />
            <ThemedText style={styles.typeStatText}>Hotels: {authorityStats.hotels}</ThemedText>
          </View>
          <View style={styles.typeStatItem}>
            <IconSymbol name="building.columns.fill" size={16} color="#FF9800" />
            <ThemedText style={styles.typeStatText}>Monuments: {authorityStats.monuments}</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* System Information */}
      <ThemedView style={styles.systemInfoContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>System Information</ThemedText>
        <View style={styles.systemInfoList}>
          <ThemedView style={styles.systemInfoItem}>
            <IconSymbol name="server.rack" size={20} color={colors.tint} />
            <ThemedText style={styles.systemInfoText}>System Status: Online</ThemedText>
          </ThemedView>
          <ThemedView style={styles.systemInfoItem}>
            <IconSymbol name="shield.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.systemInfoText}>Security Level: High</ThemedText>
          </ThemedView>
          <ThemedView style={styles.systemInfoItem}>
            <IconSymbol name="clock.fill" size={20} color="#FF9800" />
            <ThemedText style={styles.systemInfoText}>Last Backup: 2 hours ago</ThemedText>
          </ThemedView>
          <ThemedView style={styles.systemInfoItem}>
            <IconSymbol name="wifi" size={20} color="#2196F3" />
            <ThemedText style={styles.systemInfoText}>Network: Connected</ThemedText>
          </ThemedView>
        </View>
      </ThemedView>

      {/* Add Authority Modal */}
      <Modal
        visible={showAddAuthorityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>Add New Authority</ThemedText>
            <TouchableOpacity onPress={() => setShowAddAuthorityModal(false)}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Authority Name *</ThemedText>
              <TextInput
                style={styles.input}
                value={newAuthority.name}
                onChangeText={(text) => setNewAuthority({...newAuthority, name: text})}
                placeholder="e.g., Delhi Airport"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Ethereum Address *</ThemedText>
              <TextInput
                style={styles.input}
                value={newAuthority.address}
                onChangeText={(text) => setNewAuthority({...newAuthority, address: text})}
                placeholder="0x..."
                placeholderTextColor="#666"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Authority Type *</ThemedText>
              <View style={styles.typeSelector}>
                {['Airport', 'Hotel', 'Monument', 'Police Station', 'Hospital'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      newAuthority.type === type && { backgroundColor: colors.tint }
                    ]}
                    onPress={() => setNewAuthority({...newAuthority, type: type as any})}
                  >
                    <IconSymbol 
                      name={getTypeIcon(type)} 
                      size={16} 
                      color={newAuthority.type === type ? 'white' : getTypeColor(type)} 
                    />
                    <ThemedText style={[
                      styles.typeOptionText,
                      newAuthority.type === type && { color: 'white' }
                    ]}>
                      {type}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAddAuthorityModal(false)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleAddAuthority}
            >
              <ThemedText style={styles.submitButtonText}>Add Authority</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  typeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeStatText: {
    fontSize: 14,
    color: '#666',
  },
  systemInfoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemInfoList: {
    gap: 12,
  },
  systemInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 12,
  },
  systemInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  authorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  authorityInfo: {
    flex: 1,
  },
  authorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorityNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  authorityType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  authorityAddress: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  authorityDetails: {
    fontSize: 12,
    color: '#999',
  },
  revokeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffebee',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 6,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
