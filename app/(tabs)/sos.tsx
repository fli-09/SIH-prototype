import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface SOSAlert {
  id: string;
  touristId: string;
  touristName: string;
  location: string;
  timestamp: string;
  status: 'Active' | 'Responded' | 'Resolved' | 'Awaiting Response' | 'Responded Safely' | 'ACTION REQUIRED';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function SOSScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout } = useAuth();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const initialAlerts: SOSAlert[] = [
      {
        id: 'SOS-001', touristId: 'UID-003', touristName: 'Ahmed Hassan', location: 'Red Fort, Delhi',
        timestamp: '2024-01-15 16:45:00', status: 'Active', priority: 'High',
        description: 'Tourist reported feeling unwell and lost.',
        coordinates: { latitude: 28.6562, longitude: 77.2410 }
      },
    ];
    setAlerts(initialAlerts);

    const riskZoneTimeout = setTimeout(() => {
      const newAlert: SOSAlert = {
        id: 'GEO-001', touristId: 'UID-001', touristName: 'Yash', location: 'High-Risk Zone Alpha',
        timestamp: new Date().toLocaleTimeString(), status: 'Awaiting Response', priority: 'Medium',
        description: 'Tourist entered a high-risk geofenced zone. Awaiting safety confirmation.',
        coordinates: { latitude: 28.6, longitude: 77.2 }
      };
      setAlerts(prev => [newAlert, ...prev]);
      Alert.alert('Dashboard Update', 'A tourist has entered a risk zone. Awaiting their response.');
    }, 1000);

    // --- UPDATED: Simulate "I Need Help" instead of "No Response" ---
    const helpNeededTimeout = setTimeout(() => {
      setAlerts(prev => prev.map(a =>
        a.id === 'GEO-001'
          ? { ...a, status: 'Active', priority: 'High', description: 'Tourist entered a high-risk zone and has requested IMMEDIATE HELP.' }
          : a
      ));
      Alert.alert('!! SOS ESCALATION !!', 'Tourist John Smith (UID-001) has requested immediate help from the high-risk zone.');
    }, 8000); // 8 seconds after the initial alert

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearTimeout(riskZoneTimeout);
      clearTimeout(helpNeededTimeout); // Updated timeout clear
      pulseAnimation.stop();
    };
  }, []);

  const filteredAlerts = alerts.filter(alert =>
    filterStatus === 'All' || alert.status === filterStatus
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ff4444';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusColor = (status: SOSAlert['status']) => {
    switch (status) {
      case 'Active':
      case 'ACTION REQUIRED':
        return '#ff4444'; // Red
      case 'Responded':
      case 'Awaiting Response':
        return '#FF9800'; // Yellow/Orange
      case 'Resolved':
      case 'Responded Safely':
        return '#4CAF50'; // Green
      default:
        return '#666';
    }
  };

  const handleResolveAlert = (alertId: string) => {
    Alert.alert('Resolve Alert', 'Are you sure you want to mark this alert as resolved?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Resolve', onPress: () => setAlerts(prev => prev.map(alert => alert.id === alertId ? { ...alert, status: 'Resolved' as const } : alert)) }
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } }
    ]);
  };

  const AlertCard = ({ alert }: { alert: SOSAlert }) => (
    <ThemedView style={[styles.alertCard, (alert.status === 'Active' || alert.status === 'ACTION REQUIRED') && styles.activeAlertCard]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertIdContainer}>
          <ThemedText style={styles.alertId}>{alert.id}</ThemedText>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
            <ThemedText style={styles.priorityText}>{alert.priority}</ThemedText>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alert.status) }]}>
          <ThemedText style={styles.statusText}>{alert.status}</ThemedText>
        </View>
      </View>

      <View style={styles.alertContent}>
        <ThemedText style={styles.touristName}>{alert.touristName}</ThemedText>
        <ThemedText style={styles.touristId}>Tourist ID: {alert.touristId}</ThemedText>
        <ThemedText style={styles.location}><IconSymbol name="location.fill" size={14} color="#666" /> {alert.location}</ThemedText>
        <ThemedText style={styles.timestamp}><IconSymbol name="clock.fill" size={14} color="#666" /> {alert.timestamp}</ThemedText>
        <ThemedText style={styles.description}>{alert.description}</ThemedText>
      </View>

      {(alert.status === 'Active' || alert.status === 'ACTION REQUIRED') && (
        <Animated.View style={[styles.pulseIndicator, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.pulseDot} />
        </Animated.View>
      )}

      <View style={styles.alertActions}>
        {(alert.status === 'ACTION REQUIRED' || alert.status === 'Active') && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleResolveAlert(alert.id)}
          >
            <IconSymbol name="checkmark.shield" size={16} color="white" />
            <ThemedText style={styles.actionButtonText}>Resolve</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.tint }]}>
          <IconSymbol name="map.fill" size={16} color="white" />
          <ThemedText style={styles.actionButtonText}>View Details</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  const activeAlertsCount = alerts.filter(alert => ['Active', 'ACTION REQUIRED', 'Awaiting Response'].includes(alert.status)).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.headerTitle}>SOS Alerts</ThemedText>
            {activeAlertsCount > 0 && (
              <View style={styles.alertCountBadge}>
                <ThemedText style={styles.alertCountText}>{activeAlertsCount}</ThemedText>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.headerSubtitle}>Real-time emergency monitoring</ThemedText>
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#ff4444' }]}>
            {alerts.filter(a => a.status === 'Active' || a.status === 'ACTION REQUIRED').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>High Priority</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#FF9800' }]}>
            {alerts.filter(a => a.status === 'Responded' || a.status === 'Awaiting Response').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>In Progress</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#4CAF50' }]}>
            {alerts.filter(a => a.status === 'Resolved' || a.status === 'Responded Safely').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Resolved</ThemedText>
        </View>
      </ThemedView>

      {/* Filter */}
      <ThemedView style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Awaiting Response', 'ACTION REQUIRED', 'Responded Safely', 'Active', 'Resolved'].map((status) => (
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

      {/* Alerts List */}
      <ScrollView style={styles.alertsList}>
        {filteredAlerts.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="checkmark.shield" size={48} color="#ccc" />
            <ThemedText style={styles.emptyStateText}>No alerts found</ThemedText>
          </ThemedView>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  alertCountBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  alertCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  alertsList: {
    flex: 1,
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  activeAlertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
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
  alertContent: {
    marginBottom: 16,
  },
  touristName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  touristId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  pulseIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});