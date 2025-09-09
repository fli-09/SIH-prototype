import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface Tourist {
  id: string;
  name: string;
  passportNumber: string;
  registrationAuthority: string;
  registrationTimestamp: string;
  currentStatus: 'Active' | 'Inactive' | 'SOS' | 'Checked Out';
  nationality: string;
  phoneNumber: string;
}

export default function TouristsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [newTourist, setNewTourist] = useState({
    name: '',
    passportNumber: '',
    nationality: '',
    phoneNumber: '',
  });

  // Mock data for demonstration
  const tourists: Tourist[] = [
    {
      id: 'UID-001',
      name: 'John Smith',
      passportNumber: 'A1234567',
      registrationAuthority: 'Delhi Airport',
      registrationTimestamp: '2024-01-15 10:30:00',
      currentStatus: 'Active',
      nationality: 'USA',
      phoneNumber: '+1-555-0123'
    },
    {
      id: 'UID-002',
      name: 'Maria Garcia',
      passportNumber: 'B2345678',
      registrationAuthority: 'Mumbai Airport',
      registrationTimestamp: '2024-01-15 14:20:00',
      currentStatus: 'Active',
      nationality: 'Spain',
      phoneNumber: '+34-666-7890'
    },
    {
      id: 'UID-003',
      name: 'Ahmed Hassan',
      passportNumber: 'C3456789',
      registrationAuthority: 'Taj Hotel',
      registrationTimestamp: '2024-01-15 16:45:00',
      currentStatus: 'SOS',
      nationality: 'Egypt',
      phoneNumber: '+20-123-4567'
    },
    {
      id: 'UID-004',
      name: 'Yuki Tanaka',
      passportNumber: 'D4567890',
      registrationAuthority: 'Delhi Airport',
      registrationTimestamp: '2024-01-14 09:15:00',
      currentStatus: 'Checked Out',
      nationality: 'Japan',
      phoneNumber: '+81-90-1234-5678'
    },
    {
      id: 'UID-005',
      name: 'Emma Johnson',
      passportNumber: 'E5678901',
      registrationAuthority: 'Red Fort',
      registrationTimestamp: '2024-01-15 11:00:00',
      currentStatus: 'Active',
      nationality: 'UK',
      phoneNumber: '+44-7700-900123'
    }
  ];

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tourist.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tourist.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || tourist.currentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'SOS': return '#ff4444';
      case 'Inactive': return '#FF9800';
      case 'Checked Out': return '#9E9E9E';
      default: return '#666';
    }
  };

  const handleRegisterTourist = () => {
    if (!newTourist.name || !newTourist.passportNumber || !newTourist.nationality || !newTourist.phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Here you would call your backend API
    Alert.alert('Success', 'Tourist registered successfully!');
    setShowRegistrationModal(false);
    setNewTourist({ name: '', passportNumber: '', nationality: '', phoneNumber: '' });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const TouristRow = ({ tourist }: { tourist: Tourist }) => (
    <ThemedView style={styles.touristRow}>
      <View style={styles.touristInfo}>
        <View style={styles.touristHeader}>
          <ThemedText style={styles.touristId}>{tourist.id}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tourist.currentStatus) }]}>
            <ThemedText style={styles.statusText}>{tourist.currentStatus}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.touristName}>{tourist.name}</ThemedText>
        <ThemedText style={styles.touristDetails}>Passport: {tourist.passportNumber} • {tourist.nationality}</ThemedText>
        <ThemedText style={styles.touristDetails}>Authority: {tourist.registrationAuthority}</ThemedText>
        <ThemedText style={styles.touristDetails}>Registered: {tourist.registrationTimestamp}</ThemedText>
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <IconSymbol name="ellipsis" size={20} color={colors.tint} />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.headerTitle}>Tourist Management</ThemedText>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: colors.tint }]}
          onPress={() => setShowRegistrationModal(true)}
        >
          <IconSymbol name="person.badge.plus" size={20} color="white" />
          <ThemedText style={styles.registerButtonText}>Register New Tourist</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Search and Filter */}
      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, passport, or UID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['All', 'Active', 'SOS', 'Inactive', 'Checked Out'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && { backgroundColor: colors.tint }
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <ThemedText style={[
                styles.filterText,
                filterStatus === status && { color: 'white' }
              ]}>
                {status}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Tourist List */}
      <ScrollView style={styles.touristList}>
        {filteredTourists.map((tourist) => (
          <TouristRow key={tourist.id} tourist={tourist} />
        ))}
      </ScrollView>

      {/* Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>Register New Tourist</ThemedText>
            <TouchableOpacity onPress={() => setShowRegistrationModal(false)}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name *</ThemedText>
              <TextInput
                style={styles.input}
                value={newTourist.name}
                onChangeText={(text) => setNewTourist({...newTourist, name: text})}
                placeholder="Enter full name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Passport Number *</ThemedText>
              <TextInput
                style={styles.input}
                value={newTourist.passportNumber}
                onChangeText={(text) => setNewTourist({...newTourist, passportNumber: text})}
                placeholder="Enter passport number"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Nationality *</ThemedText>
              <TextInput
                style={styles.input}
                value={newTourist.nationality}
                onChangeText={(text) => setNewTourist({...newTourist, nationality: text})}
                placeholder="Enter nationality"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Phone Number *</ThemedText>
              <TextInput
                style={styles.input}
                value={newTourist.phoneNumber}
                onChangeText={(text) => setNewTourist({...newTourist, phoneNumber: text})}
                placeholder="Enter phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowRegistrationModal(false)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleRegisterTourist}
            >
              <ThemedText style={styles.submitButtonText}>Register Tourist</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  touristList: {
    flex: 1,
    padding: 16,
  },
  touristRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touristInfo: {
    flex: 1,
  },
  touristHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  touristId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
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
  touristName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  touristDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actionButton: {
    padding: 8,
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
