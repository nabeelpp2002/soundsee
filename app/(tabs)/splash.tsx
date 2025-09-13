import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function SplashScreen() {
    const router = useRouter();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));

    const getSessionId = async () => {
        try {
            const sessionData = await AsyncStorage.getItem("sessionId");
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                const sessionId = parsed.sessionId;
                return sessionId;
            }
            return null;
        } catch (error) {
            console.error('Failed to get session ID:', error);
            return null;
        }
    };

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.elastic(1),
                useNativeDriver: true,
            })
        ]).start();

        const initialize = async () => {
            const sessionId = await getSessionId();

            setTimeout(() => {
                if (sessionId) {
                    router.replace('/index'); 
                } else {
                    router.replace('/SignUp'); 
                }
            }, 2000);
        };

        initialize();
    }, []);

    return (
        <LinearGradient
            colors={['#cc0000', '#990000', '#660000']}
            style={styles.container}
        >
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.text}>Sound</Text>
                    <View style={styles.dot} />
                    <Text style={styles.text}>See</Text>
                </View>
                
                <Text style={styles.subtitle}>Immerse Yourself in Experience</Text>
                
                <ActivityIndicator 
                    size="large" 
                    color="#fff" 
                    style={styles.spinner} 
                />
                
                <Text style={styles.footerText}>Loading your experience...</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 52,
        fontWeight: '800',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        letterSpacing: 1,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 40,
        fontStyle: 'italic',
        letterSpacing: 0.5,
    },
    spinner: {
        marginTop: 30,
        marginBottom: 20,
        transform: [{ scale: 1.2 }],
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 10,
    },
});