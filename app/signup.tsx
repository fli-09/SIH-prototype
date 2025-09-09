import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tourist' as 'admin' | 'authority' | 'viewer' | 'tourist',
    authorityName: '',
    authorityType: 'Airport' as 'Airport' | 'Hotel' | 'Monument' | 'Police Station' | 'Hospital'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.role === 'authority' && !formData.authorityName) {
      Alert.alert('Error', 'Please provide authority name');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const success = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.role === 'authority' ? formData.authorityName : undefined,
      formData.role === 'authority' ? formData.authorityType : undefined
    );

    if (success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } else {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'person.crop.circle.fill';
      case 'authority': return 'building.2.fill';
      case 'viewer': return 'eye.fill';
      case 'tourist': return 'person.fill';
      default: return 'person.fill';
    }
  };

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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.tint }]}>
              <IconSymbol name="person.badge.plus" size={40} color="white" />
            </View>
            <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join the Tourist Safety Network</ThemedText>
          </View>

          {/* Signup Form */}
          <View style={styles.form}>
            <ThemedText type="subtitle" style={styles.formTitle}>Sign Up</ThemedText>
            
            {/* Basic Information */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name *</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="person.fill" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email Address *</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="envelope.fill" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Password *</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="lock.fill" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol 
                    name={showPassword ? "eye.slash.fill" : "eye.fill"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Confirm Password *</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="lock.fill" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IconSymbol 
                    name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Account Type *</ThemedText>
              <View style={styles.roleSelector}>
                {[
                  { value: 'tourist', label: 'Tourist', description: 'Access tourist safety features' },
                  { value: 'admin', label: 'Administrator', description: 'Full system access' }
                ].map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      formData.role === role.value && { backgroundColor: colors.tint }
                    ]}
                    onPress={() => handleInputChange('role', role.value)}
                  >
                    <IconSymbol 
                      name={getRoleIcon(role.value)} 
                      size={20} 
                      color={formData.role === role.value ? 'white' : colors.tint} 
                    />
                    <View style={styles.roleTextContainer}>
                      <ThemedText style={[
                        styles.roleLabel,
                        formData.role === role.value && { color: 'white' }
                      ]}>
                        {role.label}
                      </ThemedText>
                      <ThemedText style={[
                        styles.roleDescription,
                        formData.role === role.value && { color: 'rgba(255,255,255,0.8)' }
                      ]}>
                        {role.description}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Authority Information (only for authority role) */}
            {formData.role === 'authority' && (
              <>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Authority Name *</ThemedText>
                  <View style={styles.inputContainer}>
                    <IconSymbol name="building.2.fill" size={20} color="#666" />
                    <TextInput
                      style={styles.input}
                      value={formData.authorityName}
                      onChangeText={(value) => handleInputChange('authorityName', value)}
                      placeholder="e.g., Delhi Airport"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Authority Type *</ThemedText>
                  <View style={styles.typeSelector}>
                    {['Airport', 'Hotel', 'Monument', 'Police Station', 'Hospital'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeOption,
                          formData.authorityType === type && { backgroundColor: colors.tint }
                        ]}
                        onPress={() => handleInputChange('authorityType', type)}
                      >
                        <IconSymbol 
                          name={getTypeIcon(type)} 
                          size={16} 
                          color={formData.authorityType === type ? 'white' : colors.tint} 
                        />
                        <ThemedText style={[
                          styles.typeOptionText,
                          formData.authorityType === type && { color: 'white' }
                        ]}>
                          {type}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity 
              style={[styles.signupButton, { backgroundColor: colors.tint }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ThemedText style={styles.signupButtonText}>Creating Account...</ThemedText>
              ) : (
                <ThemedText style={styles.signupButtonText}>Create Account</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.loginLinkText}>
                Already have an account? <ThemedText style={styles.loginLinkTextBold}>Sign In</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  roleSelector: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
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
  signupButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkTextBold: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
