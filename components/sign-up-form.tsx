import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { authService } from '@/lib/services/auth';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

export function SignUpForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);

  function onNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await authService.register(formData);

      if (result.success) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                autoCapitalize="words"
                value={formData.name}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                onSubmitEditing={onNameSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <View className="relative">
                <Input
                  ref={passwordInputRef}
                  id="password"
                  placeholder="At least 6 characters"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  className="pr-12"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 items-center justify-center">
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </Pressable>
              </View>
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Creating Account...' : 'Continue'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => {
                router.push('/');
              }}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
