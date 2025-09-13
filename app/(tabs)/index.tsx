import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SoundSeeApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus] = useState(new Animated.Value(0));

  const startRecording = () => {
    setIsRecording(true);
    // Animation for recording button
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordingStatus, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(recordingStatus, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
    
    // Here you would integrate with your audio recording API
    Alert.alert('Recording Started', 'SoundSee is now listening to your surroundings');
  };

  const stopRecording = () => {
    setIsRecording(false);
    recordingStatus.stopAnimation();
    
    // Here you would stop the audio recording and process with your ML model
    Alert.alert('Recording Stopped', 'Analyzing the recorded sounds...');
  };

  const pulseAnimation = recordingStatus.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placehold.co/400x400/6a5acd/white?text=SoundSee' }}
          style={styles.logo}
        />
        <Text style={styles.title}>SoundSee</Text>
        <Text style={styles.subtitle}>Hear the world through AI</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to SoundSee</Text>
        
      </View>

      <View style={styles.recordingSection}>
        <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnimation }] }]}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "mic"} 
              size={40} 
              color="white" 
            />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.recordText}>
          {isRecording ? 'Listening for sounds...' : 'Tap to identify surrounding sounds'}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <View style={styles.infoItem}>
          <Ionicons name="mic-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>Record surrounding sounds</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="analytics-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>AI analyzes the audio</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="notifications-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>Get visual notifications</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#6a5acd',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  recordingSection: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
  },
  recordButtonContainer: {
    marginBottom: 15,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6a5acd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  recordingButton: {
    backgroundColor: '#e74c3c',
  },
  recordText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  infoSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
});

export default SoundSeeApp;