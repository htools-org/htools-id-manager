import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { HandshakeLogin, Strategies } from 'handshake-login';
import './assets/tailwind.css';

const app = createApp(App);
app.use(router);

app.provide('$hLogin', new HandshakeLogin({ useDoh: true }));
app.provide('$hStrategies', Strategies);

app.mount('#app');
