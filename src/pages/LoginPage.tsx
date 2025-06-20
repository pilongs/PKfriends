import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => void;
}

// Demo: List of invited phone numbers
const invitedPhoneNumbers = ["01012345678", "01087654321"];

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    console.log("실제 앱에서는 여기서 휴대폰 인증 팝업을 띄웁니다.");
    onLogin();
  };

  const handleSignupCheck = () => {
    if (!phoneNumber) {
      toast.error("휴대폰 번호를 입력해주세요.");
      return;
    }

    if (invitedPhoneNumbers.includes(phoneNumber)) {
      toast.success("초대된 사용자입니다. 본인 인증을 진행합니다.");
      // In a real app, you would proceed to the actual identity verification process.
      // For demo, we'll just log it.
      console.log(`Proceeding with verification for ${phoneNumber}`);
    } else {
      toast.error("초대받지 않은 번호입니다. 관리자에게 문의하세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">PK Friends</CardTitle>
          <CardDescription>No 1. 약동학 분석 시스템</CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'login' && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground space-y-1">
                <p>PK Friends는 초대 기반으로 운영하고 있습니다.</p>
                <p>사용에 관심있으신 분은 contact@pkfriend.co.kr로 문의주세요.</p>
              </div>
              <Button onClick={handleLogin} className="w-full flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                본인 간편 인증 후 로그인
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setView('signup')}>
                  회원가입
                </Button>
              </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                초대 받은 휴대폰 번호를 입력해주세요.
              </p>
              <Input
                type="tel"
                placeholder="휴대폰 번호 ('-' 제외)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button onClick={handleSignupCheck} className="w-full">
                확인
              </Button>
              <Button variant="ghost" onClick={() => setView('login')} className="w-full flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                로그인으로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage; 