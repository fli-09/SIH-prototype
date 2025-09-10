import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface TouristProfile {
  uid: string;
  name: string;
  email: string;
  nationality: string;
  passportNumber: string;
  phoneNumber: string;
  emergencyContact: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  bloodType: string;
  medicalConditions: string;
  allergies: string;
  currentLocation: string;
  checkInHistory: Array<{
    location: string;
    timestamp: string;
    status: string;
  }>;
}

export default function TouristProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Mock tourist profile data
  const [profile, setProfile] = useState<TouristProfile>({
    uid: 'UID-001',
    name: user?.name || 'Tourist',
    email: user?.email || 'tourist@example.com',
    nationality: 'USA',
    passportNumber: 'A1234567',
    phoneNumber: '+1-555-0123',
    emergencyContact: 'Chut Marika',
    emergencyContactPhone: '+1-555-0124',
    emergencyContactRelation: 'Father',
    bloodType: 'O+',
    medicalConditions: 'None',
    allergies: 'None',
    currentLocation: 'Delhi Airport',
    checkInHistory: [
      { location: 'Delhi Airport Terminal 3', timestamp: '2024-01-15 10:30:00', status: 'Checked In' },
      { location: 'Taj Palace Hotel', timestamp: '2024-01-14 18:45:00', status: 'Checked Out' },
      { location: 'Red Fort', timestamp: '2024-01-14 14:20:00', status: 'Visited' },
      { location: 'India Gate', timestamp: '2024-01-13 16:30:00', status: 'Visited' }
    ]
  });

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;

    setProfile(prev => ({
      ...prev,
      [editingField]: editValue
    }));

    setShowEditModal(false);
    setEditingField(null);
    setEditValue('');
    Alert.alert('Success', 'Profile updated successfully!');
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

  const ProfileField = ({
    label,
    value,
    field,
    icon,
    editable = true
  }: {
    label: string;
    value: string;
    field: string;
    icon: string;
    editable?: boolean;
  }) => (
    <ThemedView style={styles.profileField}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldLabelContainer}>
          <IconSymbol name={icon} size={16} color={colors.tint} />
          <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
        </View>
        {editable && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditField(field, value)}
          >
            <IconSymbol name="pencil" size={14} color={colors.tint} />
          </TouchableOpacity>
        )}
      </View>
      <ThemedText style={styles.fieldValue}>{value}</ThemedText>
    </ThemedView>
  );

  const CheckInHistoryItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <IconSymbol
          name={item.status === 'Checked In' ? 'checkmark.circle.fill' :
            item.status === 'Checked Out' ? 'xmark.circle.fill' : 'location.fill'}
          size={16}
          color={item.status === 'Checked In' ? '#4CAF50' :
            item.status === 'Checked Out' ? '#ff4444' : colors.tint}
        />
      </View>
      <View style={styles.historyContent}>
        <ThemedText style={styles.historyLocation}>{item.location}</ThemedText>
        <ThemedText style={styles.historyTimestamp}>{item.timestamp}</ThemedText>
      </View>
      <View style={[styles.statusBadge, {
        backgroundColor: item.status === 'Checked In' ? '#e8f5e8' :
          item.status === 'Checked Out' ? '#ffebee' : '#e3f2fd'
      }]}>
        <ThemedText style={[styles.statusText, {
          color: item.status === 'Checked In' ? '#4CAF50' :
            item.status === 'Checked Out' ? '#ff4444' : colors.tint
        }]}>
          {item.status}
        </ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>My Profile</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Manage your tourist information</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Profile Avatar */}
      <ThemedView style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <IconSymbol name="person.fill" size={40} color="white" />
        </View>
        <ThemedText style={styles.avatarName}>{profile.name}</ThemedText>
        <ThemedText style={styles.avatarUid}>{profile.uid}</ThemedText>
      </ThemedView>

      {/* Personal Information */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
        <ProfileField label="Full Name" value={profile.name} field="name" icon="person.fill" />
        <ProfileField label="Email" value={profile.email} field="email" icon="envelope.fill" />
        <ProfileField label="Nationality" value={profile.nationality} field="nationality" icon="flag.fill" />
        <ProfileField label="Passport Number" value={profile.passportNumber} field="passportNumber" icon="doc.text.fill" />
        <ProfileField label="Phone Number" value={profile.phoneNumber} field="phoneNumber" icon="phone.fill" />
      </ThemedView>

      {/* Emergency Information */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Emergency Information</ThemedText>
        <ProfileField label="Emergency Contact" value={profile.emergencyContact} field="emergencyContact" icon="person.2.fill" />
        <ProfileField label="Emergency Phone" value={profile.emergencyContactPhone} field="emergencyContactPhone" icon="phone.fill" />
        <ProfileField label="Relationship" value={profile.emergencyContactRelation} field="emergencyContactRelation" icon="heart.fill" />
        <ProfileField label="Blood Type" value={profile.bloodType} field="bloodType" icon="drop.fill" />
        <ProfileField label="Medical Conditions" value={profile.medicalConditions} field="medicalConditions" icon="cross.fill" />
        <ProfileField label="Allergies" value={profile.allergies} field="allergies" icon="exclamationmark.triangle.fill" />
      </ThemedView>

      {/* Current Status */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Current Status</ThemedText>
        <ProfileField label="Current Location" value={profile.currentLocation} field="currentLocation" icon="location.fill" editable={false} />
        <ThemedView style={styles.statusCard}>
          <View style={styles.statusItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.statusLabel}>Status: Active</ThemedText>
          </View>
          <View style={styles.statusItem}>
            <IconSymbol name="shield.fill" size={20} color="#2196F3" />
            <ThemedText style={styles.statusLabel}>Safety Score: 85%</ThemedText>
          </View>
        </ThemedView>
      </ThemedView>

      {/* Check-in History */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Check-in History</ThemedText>
        <View style={styles.historyList}>
          {profile.checkInHistory.map((item, index) => (
            <CheckInHistoryItem key={index} item={item} />
          ))}
        </View>
      </ThemedView>

      {/* Settings */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
        <TouchableOpacity style={styles.settingItem}>
          <IconSymbol name="bell.fill" size={20} color={colors.tint} />
          <ThemedText style={styles.settingText}>Notifications</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <IconSymbol name="lock.fill" size={20} color={colors.tint} />
          <ThemedText style={styles.settingText}>Privacy & Security</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <IconSymbol name="questionmark.circle.fill" size={20} color={colors.tint} />
          <ThemedText style={styles.settingText}>Help & Support</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>Edit Profile</ThemedText>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ThemedText style={styles.modalLabel}>
              {editingField?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </ThemedText>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField?.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSaveEdit}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ScrollView>
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
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  avatarUid: {
    fontSize: 14,
    color: '#666',
  },
  section: {
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
  profileField: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  editButton: {
    padding: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#333',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  modalInput: {
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
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
