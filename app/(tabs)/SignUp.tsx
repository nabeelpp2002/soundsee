import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  TextInput,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import axios from 'axios';
import OTPTextInput from 'react-native-otp-textinput';

const SignUp = () => {
  const router = useRouter();
  const { apiUrl } = Constants.expoConfig.extra;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifiyingOtp, setIsVerifiyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const handleVerifyEmail = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    
    setIsSendingOtp(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/signup`, {
        firstName: name,
        lastName: '',
        email,
        password,
        phoneNumber: '',
        userType: 'user',
      });
      
      if (response.status == 200) {
        Alert.alert('OTP Sent', 'Check your email for the code!');
        setShowOtp(true);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    
    setIsVerifiyingOtp(true);
    try {
      const otpRes = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
        email,
        otp,
      });

      if (otpRes.status === 200) {
        const data = otpRes.data;
        Alert.alert('Success', 'Email Verified');
        setShowOtp(false);
        router.replace({
          pathname: '/jobdetails',
          params: { userId: data.userId },
        });
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Verification failed');
    } finally {
      setIsVerifiyingOtp(false);
    }
  };

  const handleResend = async () => {
    setIsResendingOtp(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/resend-otp`, { email });

      if (response.status === 200) {
        Alert.alert('OTP Sent', 'Check your email for the code!');
        setResendTimer(30);
        setShowResend(false);
      }
    } catch (err) {
      console.error('OTP Resend Error:', err);
      Alert.alert('Error', err?.response?.data?.message || 'OTP resend failed');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleLoginClick = () => {
    router.replace('/SignIn');
  };

  // Resend timer effect
  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [resendTimer]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.subheading}>Enter your personal information here</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleVerifyEmail}>
            <Text style={styles.signUpButtonText}>Verify Email</Text>
          </TouchableOpacity>

          {/* Divider Line */}
         

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginClick}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* OTP Modal */}
      {showOtp && (
        <View style={styles.overlay}>
          <View style={styles.otpContainerBox}>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <OTPTextInput
              inputCount={6}
              handleTextChange={setOtp}
              tintColor="#cc0000"
              offTintColor="#ccc"
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {showResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
            )}
          </View>
        </View>
      )}

      {/* Loading Overlays */}
      {isSendingOtp && <LoadingOverlay text="Sending OTP..." />}
      {isVerifiyingOtp && <LoadingOverlay text="Verifying OTP..." />}
      {isResendingOtp && <LoadingOverlay text="Resending OTP..." />}
    </SafeAreaView>
  );
};

const LoadingOverlay = ({ text }) => (
  <View style={styles.overlay2}>
    <View style={styles.otpContainerBox2}>
      <ActivityIndicator size="large" color="#cc0000" />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  form: {
    padding: 20,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 28,
    textAlign: 'center',
    color: '#999',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  signUpButton: {
    backgroundColor: '#6a5acd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#6a5acd',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 20,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  otpContainerBox: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  overlay2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  otpContainerBox2: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  otpContainer: {
    marginBottom: 16,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    fontSize: 20,
    backgroundColor: '#f8f8f8',
  },
  submitButton: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resendText: {
    color: '#cc0000',
    fontSize: 14,
  },
  timerText: {
    color: '#aaa',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 12,
    color: '#333',
  },
});

export default SignUp;