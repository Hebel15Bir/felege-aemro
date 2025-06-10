import './globals.css';

export const metadata = {
  title: 'ፈለገ አእምሮ ጉባኤ ቤት',
  description:
    'ይህ በመካነ ሰማዕት ቅዱስ ቂርቆስ ቤተ ክርስቲያን የፈለገ አእምሮ ጉባኤ ቤት መመዝገቢያና መቆጣጠሪያ ገጽ ነው።',
};

export default function RootLayout({ children }) {
  return (
    <html lang='am'>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
