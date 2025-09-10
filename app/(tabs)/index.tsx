import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();

  // Mock data for demonstration
  const stats = {
    totalTourists: 1247,
    authoritiesOnline: 23,
    activeSOSAlerts: 3,
    registeredToday: 45
  };

  const recentEvents = [
    { id: 1, message: "Tourist UID-001 registered at Delhi Airport", timestamp: "2 minutes ago", type: "registration" },
    { id: 2, message: "Tourist UID-002 checked into Taj Hotel", timestamp: "5 minutes ago", type: "checkin" },
    { id: 3, message: "SOS Alert from UID-003 at Red Fort", timestamp: "8 minutes ago", type: "sos" },
    { id: 4, message: "Tourist UID-004 completed safety check", timestamp: "12 minutes ago", type: "safety" },
    { id: 5, message: "New authority added: Mumbai Airport", timestamp: "15 minutes ago", type: "authority" }
  ];

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
    <ThemedView style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <IconSymbol name={icon} size={24} color={color} />
        <ThemedText style={[styles.statValue, { color }]}>{value.toLocaleString()}</ThemedText>
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
    </ThemedView>
  );

  const EventItem = ({ event }: { event: any }) => (
    <ThemedView style={styles.eventItem}>
      <View style={styles.eventIcon}>
        <IconSymbol
          name={event.type === 'sos' ? 'exclamationmark.triangle.fill' :
            event.type === 'registration' ? 'person.badge.plus' :
              event.type === 'checkin' ? 'building.2.fill' :
                event.type === 'safety' ? 'checkmark.shield.fill' : 'gear.fill'}
          size={16}
          color={event.type === 'sos' ? '#ff4444' : colors.tint}
        />
      </View>
      <View style={styles.eventContent}>
        <ThemedText style={styles.eventMessage}>{event.message}</ThemedText>
        <ThemedText style={styles.eventTimestamp}>{event.timestamp}</ThemedText>
      </View>
    </ThemedView>
  );

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

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Tourist Safety Dashboard</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Real-time monitoring and management</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="power" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <IconSymbol name="person.fill" size={20} color="white" />
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <ThemedText style={styles.userRole}>
              {user?.role === 'admin' ? 'Administrator' :
                user?.role === 'authority' ? `${user?.authorityType} Authority` :
                  'Viewer'}
            </ThemedText>
            {user?.authorityName && (
              <ThemedText style={styles.userAuthority}>{user.authorityName}</ThemedText>
            )}
          </View>
        </View>
      </ThemedView>

      {/* Key Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Key Statistics</ThemedText>
        <View style={styles.statsGrid}>
          <StatCard title="Total Active Tourists" value={stats.totalTourists} icon="person.2.fill" color="#4CAF50" />
          <StatCard title="Authorities Online" value={stats.authoritiesOnline} icon="building.2.fill" color="#2196F3" />
          <StatCard title="Active SOS Alerts" value={stats.activeSOSAlerts} icon="exclamationmark.triangle.fill" color="#ff4444" />
          <StatCard title="Registered Today" value={stats.registeredToday} icon="calendar.badge.plus" color="#FF9800" />
        </View>
      </ThemedView>

      {/* Live Event Feed */}
      <ThemedView style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Live Event Feed</ThemedText>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => Alert.alert('Refresh', 'Event feed refreshed!')}
          >
            <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>
        <View style={styles.eventsList}>
          {recentEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.actionsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/(tabs)/tourists')}
          >
            <IconSymbol name="person.badge.plus" size={24} color="white" />
            <ThemedText style={styles.actionText}>Manage Tourists</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
            onPress={() => router.push('/(tabs)/sos')}
          >
            <IconSymbol name="exclamationmark.triangle" size={24} color="white" />
            <ThemedText style={styles.actionText}>SOS Alerts</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => Alert.alert('Map View', 'Map functionality would be implemented here')}
          >
            <IconSymbol name="map.fill" size={24} color="white" />
            <ThemedText style={styles.actionText}>View Map</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
            onPress={() => router.push('/(tabs)/admin')}
          >
            <IconSymbol name="gear" size={24} color="white" />
            <ThemedText style={styles.actionText}>Admin Panel</ThemedText>
          </TouchableOpacity>
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
    marginBottom: 16,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userAuthority: {
    fontSize: 12,
    color: '#999',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  eventsContainer: {
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
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  eventsList: {
    gap: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  eventTimestamp: {
    fontSize: 12,
    color: '#666',
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
});
