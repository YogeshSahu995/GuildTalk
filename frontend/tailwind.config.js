import tailwindScrollbar from 'tailwind-scrollbar';

export default{
  theme: {
    extend: {
      backgroundImage: {
        'chat-dark': "url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')",
        'chat-light': "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"
      }
    }
  },
  plugins: [
    tailwindScrollbar({nocompatible: true}),
  ],
}