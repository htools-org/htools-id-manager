<template>
  <div class="m-6">
    <section class="mt-16">
      <h3 class="text-lg">Step 1: Generate Request URL</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-3 gap-6">
              <div class="col-span-3 sm:col-span-1">
                <label
                  for="first_name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Domain name
                  <input
                    type="text"
                    v-model="domain"
                    placeholder="domain"
                    class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>
              </div>
              <div class="col-span-3 sm:col-span-1">
                <label
                  for="first_name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Nonce
                  <input
                    type="text"
                    v-model="nonce"
                    placeholder="nonce"
                    class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>
              </div>
              <div class="col-span-3 sm:col-span-1">
                <label
                  for="first_name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Callback URL
                  <input
                    type="url"
                    v-model="callbackUrl"
                    placeholder="callbackUrl"
                    class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="generateRequestUrl"
              :disabled="!(domain && nonce && callbackUrl)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  domain &&
                  nonce &&
                  callbackUrl
                ),
              }"
            >
              Generate
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <span class="text-sm font-medium">Request URL:</span>
          <p v-if="reqUrl" class="mt-2 font-mono">
            {{ reqUrl }}
          </p>
          <p v-else class="mt-1 text-sm text-gray-500">
            Click "Generate" above.
          </p>
          <div v-if="reqData" class="mt-4">
            <span class="text-sm font-medium"
              >Request URL Query parameters:</span
            >
            <p class="mt-2 font-mono">{{ reqData }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 2: Select Strategy</h3>

      <div class="flex mt-4 space-x-4">
        <div
          v-for="strategy in $hStrategies"
          :key="strategy"
          class="p-4 border rounded-md cursor-pointer"
          :class="{
            'text-white bg-indigo-600': strategy.name == selectedStrategy.name,
          }"
          @click="selectedStrategy = strategy"
        >
          <input type="radio" v-model="selectedStrategy" :value="strategy" />
          <span class="ml-2">{{ strategy.name }}</span>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 3: Get Device Registration Info</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Get device info, generate new device id (and store) if new device.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="getDeviceRegistration"
              :disabled="!domain"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !domain,
              }"
            >
              Get
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <p class="mt-2 font-mono">
            <span class="text-sm font-medium">Device ID:</span>
            {{ deviceId || 'null' }}
          </p>
          <p class="mt-2 font-mono">
            <span class="text-sm font-medium">Prefix:</span>
            {{ prefix || 'null' }}
          </p>
          <div class="mt-4">
            <span class="text-sm font-medium">Device Info:</span>
            <p v-if="deviceInfo" class="mt-2 font-mono">{{ deviceInfo }}</p>
            <span v-else class="ml-2 text-sm text-gray-500"
              >New device, not registered yet</span
            >
          </div>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 4: Get Identity</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Get identity, generate new identity (and store) if new device.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="getIdentity"
              :disabled="!domain"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !domain,
              }"
            >
              Get
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <div class="mt-4">
            <span class="text-sm font-medium">Identity:</span>
            <p v-if="identity" class="mt-2 font-mono">{{ identity }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 5: Verify identity</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Check if this identity's fingerprint is trusted.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="verifyIdentity"
              :disabled="!(domain && prefix && identity)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  domain &&
                  prefix &&
                  identity
                ),
              }"
            >
              Verify
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <p class="mt-2 font-mono">
            <span class="text-sm font-medium">Identity Verified:</span>
            {{ identityVerified }}
          </p>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 6a: Register</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            If identity is not verified, generate TXT record to add.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="registerIdentity"
              :disabled="!(domain && prefix && identity)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  domain &&
                  prefix &&
                  identity
                ),
              }"
            >
              Generate Record
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <div class="mt-4">
            <span class="text-sm font-medium">DNS Record:</span>
            <p v-if="txtRecord" class="mt-2 font-mono">{{ txtRecord }}</p>
            <span v-else class="ml-2 text-sm text-gray-500"
              >Click "Generate Record" above.</span
            >
          </div>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg">Step 6b: Login</h3>

      <div class="grid md:grid-cols-2">
        <div class="mt-4 overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            If identity is verified, sign challenge (aka nonce / state).
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="loginIdentity"
              :disabled="
                !(
                  domain &&
                  prefix &&
                  callbackUrl &&
                  identity &&
                  identityVerified
                )
              "
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  domain &&
                  prefix &&
                  callbackUrl &&
                  identity &&
                  identityVerified
                ),
              }"
            >
              Generate Response
            </button>
          </div>
        </div>
        <div class="p-3 mt-6 overflow-auto rounded shadow bg-gray-50">
          <span class="text-sm font-medium">Response URL:</span>
          <p v-if="resUrl" class="mt-2 font-mono">
            {{ resUrl }}
          </p>
          <p v-else class="mt-1 text-sm text-gray-500">
            Click "Generate" above.
          </p>
          <div v-if="resData" class="mt-4">
            <span class="text-sm font-medium">Response Data:</span>
            <p class="mt-2 font-mono">{{ resData }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Test',
  inject: ['$hLogin', '$hStrategies'],
  components: {},
  data() {
    return {
      domain: 'rithvik',
      nonce: 'abcde',
      callbackUrl: 'http://localhost',
      reqUrl: '',
      reqData: {},
      selectedStrategy: {},
      deviceId: '',
      prefix: '',
      deviceInfo: {},
      identity: {},
      identityVerified: null,
      txtRecord: {},
      signature: '',
      resUrl: '',
      resData: {},
    };
  },
  mounted() {
    console.log(this.$hLogin);
    console.log(this.$hStrategies);
  },
  methods: {
    async generateRequestUrl() {
      this.reqUrl = '';
      this.reqUrl = await this.$hLogin.generateRequestUrl(
        this.domain,
        this.nonce,
        this.callbackUrl
      );
    },
    async getDeviceRegistration() {
      this.deviceId = await this.$hLogin.getDeviceId();
      this.prefix = await this.$hLogin.getPrefix(this.domain, this.deviceId);
      this.deviceInfo = await this.$hLogin.getDeviceRegistration(
        this.domain,
        this.prefix
      );
    },
    async getIdentity() {
      this.identity = await this.$hLogin.getIdentity(this.domain);
      if (!this.identity) {
        this.identity = await this.$hLogin.generateIdentity(this.domain);
      }
    },
    async verifyIdentity() {
      if (!this.deviceInfo) {
        this.identityVerified = false;
        return;
      }
      this.identityVerified = await this.$hLogin.verifyFingerprint(
        this.domain,
        this.prefix,
        this.identity.fingerprint
      );
    },
    async registerIdentity() {
      this.txtRecord = await this.$hLogin.formatDnsRecordToAdd(
        this.domain,
        this.prefix,
        this.identity.fingerprint
      );
    },
    async loginIdentity() {
      this.signature = await this.$hLogin.sign(this.domain, this.nonce);
      this.resUrl = await this.$hLogin.generateResponseUrl(
        this.domain,
        this.prefix,
        this.identity.publicKey,
        this.signature,
        this.callbackUrl
      );
      this.resData = JSON.parse(
        atob(this.resUrl.slice(this.resUrl.indexOf('#') + 1).trim())
      );
    },
  },
  watch: {
    async reqUrl() {
      this.reqData = {};
      if (this.reqUrl) {
        this.reqData = await this.$hLogin.parseRequestData(this.reqUrl);
      }
    },
    selectedStrategy() {
      if (this.selectedStrategy.name) {
        this.$hLogin.useStrategy(new this.selectedStrategy.strategy());
      }
    },
  },
};
</script>
