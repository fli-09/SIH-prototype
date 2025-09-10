import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function TouristHomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [pulseAnim] = useState(new Animated.Value(1));

  // State to manage the geofence zone status
  const [geofenceStatus, setGeofenceStatus] = useState<'safe' | 'risk'>('safe');

  // This function now sets the state and triggers the pop-up
  const handleSimulateGeofenceBreach = () => {
    setGeofenceStatus('risk'); // Update the UI to show the risk zone block

    // Show the demand response pop-up after a short delay
    setTimeout(() => {
      Alert.alert(
        "Safety Check",
        "You have entered a high-risk area. Please confirm you are safe.",
        [
          {
            text: "I Am Safe",
            onPress: () => Alert.alert('Safety Confirmed', 'Thank you. Authorities have been notified.'),
            style: "default"
          },
          {
            text: "I Need Help",
            onPress: handleRequestAssistance, // Use the dedicated function
            style: "destructive"
          }
        ]
      );
    }, 500);
  };

  // Function to reset the simulation
  const handleExitRiskZone = () => {
    setGeofenceStatus('safe');
    Alert.alert('Simulation Reset', 'You have left the high-risk zone.');
  };

  // Function to handle the SOS escalation
  const handleRequestAssistance = () => {
    Alert.alert(
      'SOS Activated',
      'Your request for help has been sent to local authorities. Navigating to the SOS screen now.',
      [{ text: 'OK', onPress: () => router.push('/(tabs-tourist)/sos') }]
    );
  };

  // Mock tourist data
  const touristData = {
    uid: 'UID-001',
    name: user?.name || 'Tourist',
    nationality: 'USA',
    passportNumber: 'A1234567',
    currentLocation: 'Delhi Airport',
    checkInTime: '2024-01-15 10:30:00',
    status: 'Active',
    emergencyContact: '+1-555-0123',
    authoritiesNearby: 3,
    safetyScore: 85
  };

  const recentActivities = [
    { id: 1, action: 'Checked in at Delhi Airport', time: '10:30 AM', icon: 'airplane' },
    { id: 2, action: 'Safety check completed', time: '11:15 AM', icon: 'checkmark.shield.fill' },
    { id: 3, action: 'Location updated', time: '12:45 PM', icon: 'location.fill' },
    { id: 4, action: 'Emergency contact verified', time: '1:20 PM', icon: 'phone.fill' }
  ];

  const safetyTips = [
    'Keep your passport and important documents safe',
    'Stay in well-lit areas during evening hours',
    'Inform authorities if you feel unsafe',
    'Keep emergency contacts updated'
  ];

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } }
    ]);
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) => (
    <ThemedView style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <IconSymbol name={icon} size={24} color={color} />
        <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
    </ThemedView>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <ThemedView style={styles.activityItem}>
      <View style={styles.activityIcon}><IconSymbol name={activity.icon} size={16} color={colors.tint} /></View>
      <View style={styles.activityContent}>
        <ThemedText style={styles.activityText}>{activity.action}</ThemedText>
        <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Welcome, {touristData.name}!</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Your safety is our priority</ThemedText>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.uidBadge}><ThemedText style={styles.uidText}>{touristData.uid}</ThemedText></View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><IconSymbol name="power" size={20} color="#ff4444" /></TouchableOpacity>
          </View>
        </View>
      </ThemedView>

      {/* Emergency SOS Button */}
      <ThemedView style={styles.sosContainer}>
        <Animated.View style={[styles.sosButton, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity style={styles.sosButtonInner} onPress={() => router.push('/(tabs-tourist)/sos')}>
            <IconSymbol name="exclamationmark.triangle.fill" size={32} color="white" />
            <ThemedText style={styles.sosButtonText}>EMERGENCY SOS</ThemedText>
          </TouchableOpacity>
        </Animated.View>
        <ThemedText style={styles.sosSubtext}>Tap in case of emergency</ThemedText>
      </ThemedView>

      {/* DYNAMIC GEOFENCE UI */}
      {geofenceStatus === 'safe' ? (
        <ThemedView style={styles.geofenceContainer}>
          <View style={styles.geofenceHeader}>
            <IconSymbol name="checkmark.shield.fill" size={24} color="#4CAF50" />
            <ThemedText type="subtitle" style={styles.geofenceTitle}>Safe Zone Monitoring</ThemedText>
          </View>
          <ThemedText style={styles.geofenceStatus}>
            You are currently in a Safe Zone.
          </ThemedText>
          <ThemedText style={styles.geofenceDescription}>
            We'll notify you if you enter a flagged area.
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={[styles.geofenceContainer, styles.riskZoneContainer]}>
          <View style={styles.geofenceHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#d32f2f" />
            <ThemedText type="subtitle" style={[styles.geofenceTitle, styles.riskZoneTitle]}>High-Risk Zone Alert</ThemedText>
          </View>
          <ThemedText style={[styles.geofenceStatus, styles.riskZoneText]}>
            You have entered an area with a safety advisory.
          </ThemedText>
          <TouchableOpacity style={styles.assistanceButton} onPress={handleRequestAssistance}>
            <ThemedText style={styles.assistanceButtonText}>Request Assistance</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Tourist Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Your Status</ThemedText>
        <View style={styles.statsGrid}>
          <StatCard title="Safety Score" value={`${touristData.safetyScore}%`} icon="shield.fill" color="#4CAF50" />
          <StatCard title="Authorities Nearby" value={touristData.authoritiesNearby.toString()} icon="building.2.fill" color="#2196F3" />
          <StatCard title="Current Location" value={touristData.currentLocation} icon="location.fill" color="#FF9800" />
          <StatCard title="Status" value={touristData.status} icon="checkmark.circle.fill" color="#4CAF50" />
        </View>
      </ThemedView>

      {/* Recent Activities */}
      <ThemedView style={styles.activitiesContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activities</ThemedText>
        <View style={styles.activitiesList}>
          {recentActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
        </View>
      </ThemedView>

      {/* Safety Tips */}
      <ThemedView style={styles.tipsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Safety Tips</ThemedText>
        <View style={styles.tipsList}>
          {safetyTips.map((tip, index) => (
            <ThemedView key={index} style={styles.tipItem}>
              <IconSymbol name="lightbulb.fill" size={16} color="#FFD700" />
              <ThemedText style={styles.tipText}>{tip}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.actionsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]} onPress={() => router.push('/(tabs-tourist)/checkin')}>
            <IconSymbol name="location.fill" size={24} color="white" />
            <ThemedText style={styles.actionText}>Check In</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2196F3' }]} onPress={() => Alert.alert('Support', 'Calling tourist support...')}>
            <IconSymbol name="phone.fill" size={24} color="white" />
            <ThemedText style={styles.actionText}>Call Support</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9800' }]} onPress={() => Alert.alert('Map View', 'Map functionality would be implemented here')}>
            <IconSymbol name="map.fill" size={24} color="white" />
            <ThemedText style={styles.actionText}>View Map</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.tint }]} onPress={() => router.push('/(tabs-tourist)/profile')}>
            <IconSymbol name="person.circle.fill" size={24} color="white" />
            <ThemedText style={styles.actionText}>Profile</ThemedText>
          </TouchableOpacity>

          {geofenceStatus === 'safe' ? (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#dc3545', marginTop: 12, minWidth: '100%' }]} onPress={handleSimulateGeofenceBreach}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="white" />
              <ThemedText style={styles.actionText}>High-Risk Zone Entrance</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745', marginTop: 12, minWidth: '100%' }]} onPress={handleExitRiskZone}>
              <IconSymbol name="checkmark.shield.fill" size={24} color="white" />
              <ThemedText style={styles.actionText}>Simulate Exit Risk Zone</ThemedText>
            </TouchableOpacity>
          )}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uidBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  uidText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  sosContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sosButton: {
    marginBottom: 8,
  },
  sosButtonInner: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sosSubtext: {
    fontSize: 14,
    color: '#666',
  },
  geofenceContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e8f5e9', // Light green background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a5d6a7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  geofenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  geofenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
  },
  geofenceStatus: {
    fontSize: 16,
    color: '#388e3c',
    marginBottom: 4,
  },
  geofenceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  activitiesContainer: {
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
  activitiesList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  tipsContainer: {
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
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionsContainer: {
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  // --- NEW STYLES for Risk Zone UI ---
  riskZoneContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
  },
  riskZoneTitle: {
    color: '#c62828',
  },
  riskZoneText: {
    color: '#d32f2f',
  },
  assistanceButton: {
    marginTop: 12,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  assistanceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});