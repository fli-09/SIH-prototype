import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Animated, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function TouristSOSScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [countdown, setCountdown] = useState(0);

  // Mock emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Local Police',
      phone: '100',
      relationship: 'Emergency Services'
    },
    {
      id: '2',
      name: 'Tourist Helpline',
      phone: '1363',
      relationship: 'Tourist Support'
    },
    {
      id: '3',
      name: 'Medical Emergency',
      phone: '102',
      relationship: 'Medical Services'
    },
    {
      id: '4',
      name: 'Fire Department',
      phone: '101',
      relationship: 'Fire Services'
    }
  ];

  useEffect(() => {
    // Pulse animation for emergency button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleEmergencySOS = () => {
    Alert.alert(
      'Emergency SOS',
      'Are you in immediate danger? This will alert local authorities and emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SOS', 
          style: 'destructive',
          onPress: () => {
            setIsEmergencyMode(true);
            setCountdown(10);
            Alert.alert(
              'SOS Sent!',
              'Emergency alert has been sent to local authorities. Help is on the way. Stay calm and follow instructions.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleQuickCall = (contact: EmergencyContact) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${contact.name} at ${contact.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            // In a real app, this would initiate a phone call
            Alert.alert('Calling...', `Connecting to ${contact.name}`);
          }
        }
      ]
    );
  };

  const handleLocationShare = () => {
    Alert.alert(
      'Share Location',
      'Share your current location with emergency contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            Alert.alert('Location Shared', 'Your location has been shared with emergency contacts.');
          }
        }
      ]
    );
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

  const EmergencyButton = () => (
    <Animated.View style={[styles.emergencyButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergencySOS}
        disabled={isEmergencyMode}
      >
        <IconSymbol name="exclamationmark.triangle.fill" size={40} color="white" />
        <ThemedText style={styles.emergencyButtonText}>EMERGENCY SOS</ThemedText>
        <ThemedText style={styles.emergencyButtonSubtext}>Tap for immediate help</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );

  const EmergencyMode = () => (
    <ThemedView style={styles.emergencyModeContainer}>
      <View style={styles.emergencyModeHeader}>
        <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#ff4444" />
        <ThemedText style={styles.emergencyModeTitle}>EMERGENCY MODE ACTIVE</ThemedText>
      </View>
      
      {countdown > 0 && (
        <ThemedText style={styles.countdownText}>
          Next update in: {countdown}s
        </ThemedText>
      )}
      
      <ThemedText style={styles.emergencyModeText}>
        Help is on the way! Stay calm and follow these steps:
      </ThemedText>
      
      <View style={styles.emergencySteps}>
        <ThemedText style={styles.stepText}>1. Stay in a safe location if possible</ThemedText>
        <ThemedText style={styles.stepText}>2. Keep your phone accessible</ThemedText>
        <ThemedText style={styles.stepText}>3. Follow instructions from authorities</ThemedText>
        <ThemedText style={styles.stepText}>4. Use the message feature below if needed</ThemedText>
      </View>

      <View style={styles.emergencyMessageContainer}>
        <ThemedText style={styles.messageLabel}>Emergency Message (Optional)</ThemedText>
        <TextInput
          style={styles.messageInput}
          value={emergencyMessage}
          onChangeText={setEmergencyMessage}
          placeholder="Describe your situation..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={[styles.sendMessageButton, { backgroundColor: '#ff4444' }]}>
          <ThemedText style={styles.sendMessageButtonText}>Send Message</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.cancelEmergencyButton}
        onPress={() => {
          setIsEmergencyMode(false);
          setCountdown(0);
        }}
      >
        <ThemedText style={styles.cancelEmergencyText}>Cancel Emergency</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  const ContactCard = ({ contact }: { contact: EmergencyContact }) => (
    <ThemedView style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
          <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
        </View>
        <ThemedText style={styles.contactRelationship}>{contact.relationship}</ThemedText>
      </View>
      <TouchableOpacity 
        style={[styles.callButton, { backgroundColor: colors.tint }]}
        onPress={() => handleQuickCall(contact)}
      >
        <IconSymbol name="phone.fill" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );

  if (isEmergencyMode) {
    return (
      <ScrollView style={styles.container}>
        <EmergencyMode />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Emergency SOS</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Your safety is our priority</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Emergency Button */}
      <ThemedView style={styles.emergencyContainer}>
        <EmergencyButton />
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.quickActionsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
            onPress={handleLocationShare}
          >
            <IconSymbol name="location.fill" size={24} color="white" />
            <ThemedText style={styles.quickActionText}>Share Location</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => Alert.alert('Safety Tips', '1. Stay in well-lit areas\n2. Keep emergency contacts updated\n3. Share your location regularly\n4. Trust your instincts\n5. Keep important documents safe')}
          >
            <IconSymbol name="info.circle.fill" size={24} color="white" />
            <ThemedText style={styles.quickActionText}>Safety Tips</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Emergency Contacts */}
      <ThemedView style={styles.contactsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Emergency Contacts</ThemedText>
        <View style={styles.contactsList}>
          {emergencyContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </View>
      </ThemedView>

      {/* Safety Information */}
      <ThemedView style={styles.safetyInfoContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Safety Information</ThemedText>
        <View style={styles.safetyInfoList}>
          <ThemedView style={styles.safetyInfoItem}>
            <IconSymbol name="shield.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.safetyInfoText}>
              Your location is automatically shared with authorities during emergencies
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.safetyInfoItem}>
            <IconSymbol name="phone.fill" size={20} color="#2196F3" />
            <ThemedText style={styles.safetyInfoText}>
              Emergency contacts are available 24/7 for immediate assistance
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.safetyInfoItem}>
            <IconSymbol name="location.fill" size={20} color="#FF9800" />
            <ThemedText style={styles.safetyInfoText}>
              Keep your location services enabled for better assistance
            </ThemedText>
          </ThemedView>
        </View>
      </ThemedView>
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
  emergencyContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyButtonContainer: {
    marginBottom: 8,
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emergencyButtonSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  emergencyModeContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyModeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyModeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    marginTop: 8,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyModeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  emergencySteps: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  emergencyMessageContainer: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  sendMessageButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendMessageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelEmergencyButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelEmergencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  quickActionsContainer: {
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 80,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  contactsContainer: {
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
  contactsList: {
    gap: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactRelationship: {
    fontSize: 12,
    color: '#999',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyInfoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 100,
  },
  safetyInfoList: {
    gap: 12,
  },
  safetyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 12,
  },
  safetyInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
