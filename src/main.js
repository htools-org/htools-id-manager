import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { HandshakeLogin, Strategies } from '../../handshake-login/build/main';
import './assets/tailwind.css'

const app = createApp(App);
app.use(store).use(router);

app.provide('$hLogin', new HandshakeLogin());
app.provide('$hStrategies', Strategies);

app.mount('#app');
