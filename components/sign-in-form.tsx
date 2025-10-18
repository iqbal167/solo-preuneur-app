import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { authService } from '@/lib/services/auth';
import { authStorage } from '@/lib/storage/auth';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { Alert, Pressable, type TextInput, View } from 'react-native';

export function SignInForm() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await authService.login(formData);

      if (result.success && result.data) {
        // Save tokens to storage
        await authStorage.setTokens(result.data.access_token, result.data.refresh_token);

        // Navigate to profile
        router.replace('/profile');
      } else {
        Alert.alert('Error', result.error || 'Login failed');
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
          <CardTitle className="text-center text-xl sm:text-left">Sign in to your app</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, email: text }));
                }}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
              </View>
              <View className="relative">
                <Input
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, password: text }));
                  }}
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
              <Text>{isLoading ? 'Signing In...' : 'Continue'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Pressable
              onPress={() => {
                router.push('/sign-up');
              }}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
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
