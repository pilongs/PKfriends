import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 bg-slate-50 border-t text-center text-sm text-muted-foreground">
      <a href="/terms" className="underline hover:text-primary mx-2">서비스 이용약관</a>
      |
      <a href="/privacy" className="underline hover:text-primary mx-2">개인정보처리방침</a>
    </footer>
  );
};

export default Footer; 