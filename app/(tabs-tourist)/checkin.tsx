import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface CheckInLocation {
  id: string;
  name: string;
  type: 'Airport' | 'Hotel' | 'Monument' | 'Restaurant' | 'Shopping';
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

export default function TouristCheckInScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<CheckInLocation | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInNotes, setCheckInNotes] = useState('');

  // Mock nearby locations
  const nearbyLocations: CheckInLocation[] = [
    {
      id: '1',
      name: 'Delhi Airport Terminal 3',
      type: 'Airport',
      address: 'New Delhi, 110037',
      distance: '0.2 km',
      rating: 4.5,
      isOpen: true
    },
    {
      id: '2',
      name: 'Taj Palace Hotel',
      type: 'Hotel',
      address: 'Sardar Patel Marg, New Delhi',
      distance: '1.5 km',
      rating: 4.8,
      isOpen: true
    },
    {
      id: '3',
      name: 'Red Fort',
      type: 'Monument',
      address: 'Netaji Subhash Marg, Old Delhi',
      distance: '3.2 km',
      rating: 4.3,
      isOpen: true
    },
    {
      id: '4',
      name: 'India Gate',
      type: 'Monument',
      address: 'Rajpath, New Delhi',
      distance: '2.8 km',
      rating: 4.6,
      isOpen: true
    },
    {
      id: '5',
      name: 'Connaught Place',
      type: 'Shopping',
      address: 'Connaught Place, New Delhi',
      distance: '4.1 km',
      rating: 4.2,
      isOpen: true
    }
  ];

  const filteredLocations = nearbyLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Airport': return 'airplane';
      case 'Hotel': return 'building.2.fill';
      case 'Monument': return 'building.columns.fill';
      case 'Restaurant': return 'fork.knife';
      case 'Shopping': return 'bag.fill';
      default: return 'location.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Airport': return '#2196F3';
      case 'Hotel': return '#4CAF50';
      case 'Monument': return '#FF9800';
      case 'Restaurant': return '#E91E63';
      case 'Shopping': return '#9C27B0';
      default: return '#666';
    }
  };

  const handleCheckIn = (location: CheckInLocation) => {
    setSelectedLocation(location);
    setShowCheckInModal(true);
  };

  const confirmCheckIn = () => {
    if (!selectedLocation) return;

    Alert.alert(
      'Check-in Successful',
      `You have successfully checked in at ${selectedLocation.name}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowCheckInModal(false);
            setSelectedLocation(null);
            setCheckInNotes('');
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

  const LocationCard = ({ location }: { location: CheckInLocation }) => (
    <ThemedView style={styles.locationCard}>
      <View style={styles.locationHeader}>
        <View style={styles.locationInfo}>
          <View style={styles.locationNameContainer}>
            <IconSymbol 
              name={getTypeIcon(location.type)} 
              size={20} 
              color={getTypeColor(location.type)} 
            />
            <ThemedText style={styles.locationName}>{location.name}</ThemedText>
          </View>
          <ThemedText style={styles.locationType}>{location.type}</ThemedText>
        </View>
        <View style={styles.locationStatus}>
          <View style={[styles.statusDot, { backgroundColor: location.isOpen ? '#4CAF50' : '#ff4444' }]} />
          <ThemedText style={styles.statusText}>
            {location.isOpen ? 'Open' : 'Closed'}
          </ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.locationAddress}>{location.address}</ThemedText>
      
      <View style={styles.locationFooter}>
        <View style={styles.locationDetails}>
          <View style={styles.detailItem}>
            <IconSymbol name="location.fill" size={14} color="#666" />
            <ThemedText style={styles.detailText}>{location.distance}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <ThemedText style={styles.detailText}>{location.rating}</ThemedText>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.checkInButton, { backgroundColor: colors.tint }]}
          onPress={() => handleCheckIn(location)}
        >
          <IconSymbol name="checkmark" size={16} color="white" />
          <ThemedText style={styles.checkInButtonText}>Check In</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Check In</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Let us know where you are for your safety</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </ThemedView>

      {/* Current Status */}
      <ThemedView style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <IconSymbol name="location.fill" size={20} color={colors.tint} />
          <ThemedText style={styles.statusTitle}>Current Status</ThemedText>
        </View>
        <ThemedText style={styles.statusText}>
          Last checked in: Delhi Airport Terminal 3
        </ThemedText>
        <ThemedText style={styles.statusTime}>2 hours ago</ThemedText>
      </ThemedView>

      {/* Nearby Locations */}
      <ThemedView style={styles.locationsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby Locations</ThemedText>
        <ScrollView style={styles.locationsList}>
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </ScrollView>
      </ThemedView>

      {/* Check-in Modal */}
      <Modal
        visible={showCheckInModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>Check In</ThemedText>
            <TouchableOpacity onPress={() => setShowCheckInModal(false)}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ThemedView style={styles.selectedLocationCard}>
              <View style={styles.selectedLocationHeader}>
                <IconSymbol 
                  name={getTypeIcon(selectedLocation?.type || '')} 
                  size={24} 
                  color={getTypeColor(selectedLocation?.type || '')} 
                />
                <View style={styles.selectedLocationInfo}>
                  <ThemedText style={styles.selectedLocationName}>
                    {selectedLocation?.name}
                  </ThemedText>
                  <ThemedText style={styles.selectedLocationType}>
                    {selectedLocation?.type}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.selectedLocationAddress}>
                {selectedLocation?.address}
              </ThemedText>
            </ThemedView>

            <View style={styles.notesContainer}>
              <ThemedText style={styles.notesLabel}>Additional Notes (Optional)</ThemedText>
              <TextInput
                style={styles.notesInput}
                value={checkInNotes}
                onChangeText={setCheckInNotes}
                placeholder="Any additional information..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            </View>

            <ThemedView style={styles.safetyReminder}>
              <IconSymbol name="shield.fill" size={20} color="#4CAF50" />
              <ThemedText style={styles.safetyText}>
                Your location will be shared with local authorities for your safety
              </ThemedText>
            </ThemedView>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCheckInModal(false)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: colors.tint }]}
              onPress={confirmCheckIn}
            >
              <ThemedText style={styles.confirmButtonText}>Confirm Check-in</ThemedText>
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
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  statusContainer: {
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 12,
    color: '#666',
  },
  locationsContainer: {
    flex: 1,
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
  locationsList: {
    flex: 1,
  },
  locationCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  locationType: {
    fontSize: 12,
    color: '#666',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  selectedLocationCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  selectedLocationInfo: {
    flex: 1,
  },
  selectedLocationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedLocationType: {
    fontSize: 14,
    color: '#666',
  },
  selectedLocationAddress: {
    fontSize: 14,
    color: '#666',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  safetyReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    gap: 8,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
