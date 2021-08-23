<template>
  <div class="p-6 text-gray-900">
    <section class="mt-16">
      <h3 class="text-lg text-white">Step 1: Generate Request URL</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
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
                  Challenge
                  <input
                    type="text"
                    v-model="challenge"
                    placeholder="challenge"
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
              :disabled="!(domain && challenge && callbackUrl)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  domain &&
                  challenge &&
                  callbackUrl
                ),
              }"
            >
              Generate
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
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
      <h3 class="text-lg text-white">Step 2: Select Strategy</h3>

      <div class="flex gap-4 mt-4 space-x-4 overflow-auto text-white">
        <div
          v-for="strategy in $hStrategies"
          :key="strategy"
          class="flex-shrink-0 p-4 border rounded-md cursor-pointer"
          :class="{
            'bg-indigo-600': strategy.name == selectedStrategy.name,
          }"
          @click="selectedStrategy = strategy"
        >
          <input type="radio" v-model="selectedStrategy" :value="strategy" />
          <span class="ml-2">{{ strategy.name }}</span>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg text-white">Step 3: Get Device Record</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Get device info, generate new device id (and store) if new device.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="getDeviceRecord"
              :disabled="!reqUrl"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !reqUrl,
              }"
            >
              Get
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
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
      <h3 class="text-lg text-white">Step 4: Get Identity Fingerprint</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Get identity, generate new identity (and store) if new device.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="getIdentity(false)"
              :disabled="!reqUrl"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !reqUrl,
              }"
            >
              Get
            </button>
            <button
              @click="getIdentity(true)"
              :disabled="!reqUrl"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !reqUrl,
              }"
            >
              Force Generate
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
          <div class="mt-4">
            <span class="text-sm font-medium">Identity:</span>
            <p v-if="identity" class="mt-2 font-mono">{{ identity }}</p>
          </div>
          <p v-if="dnsRecord" class="mt-2 font-mono">
            <span class="text-sm font-medium">DNS Record to add:</span>
            {{ dnsRecord || 'null' }}
          </p>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg text-white">Step 5: Verify Identity</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Check if this identity's fingerprint is trusted.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="verifyIdentity"
              :disabled="!(reqUrl && prefix && identity)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  reqUrl &&
                  prefix &&
                  identity
                ),
              }"
            >
              Verify
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
          <p class="mt-2 font-mono">
            <span class="text-sm font-medium">Identity Verified:</span>
            {{ identityVerified }}
          </p>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <h3 class="text-lg text-white">Step 6a: Register</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            If identity is not verified, generate TXT record to add.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="registerIdentity"
              :disabled="!(reqUrl && prefix && identity)"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  reqUrl &&
                  prefix &&
                  identity
                ),
              }"
            >
              Generate Record
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
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
      <h3 class="text-lg text-white">Step 6b: Login</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            If identity is verified, sign challenge (aka nonce / state).
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="loginIdentity"
              :disabled="
                !(
                  reqUrl &&
                  prefix &&
                  callbackUrl &&
                  identity &&
                  identityVerified
                )
              "
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !(
                  reqUrl &&
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
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
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

    <section class="mt-16">
      <h3 class="text-lg text-white">Step 7: Verify Signature</h3>

      <div class="grid gap-4 mt-4 md:grid-cols-2">
        <div class="overflow-hidden rounded-md shadow">
          <div class="px-4 py-5 bg-white sm:p-6">
            Check if this the signature is valid.
          </div>
          <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              @click="verifySignature"
              :disabled="!resUrl"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{
                'opacity-50 cursor-not-allowed': !resUrl,
              }"
            >
              Verify Signature
            </button>
          </div>
        </div>
        <div class="p-3 overflow-auto rounded shadow bg-gray-50">
          <p class="mt-2 font-mono">
            <span class="text-sm font-medium">Signature Verified:</span>
            {{ signatureVerified }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Test',
  inject: ['$hLogin', '$hStrategies'],
  components: {},
  data() {
    return {
      domain: '',
      challenge: '',
      callbackUrl: '',
      reqUrl: '',
      reqData: {},
      selectedStrategy: {},
      deviceId: '',
      prefix: '',
      deviceInfo: {},
      dnsRecord: {},
      txtRecord: '',
      identity: {},
      identityVerified: null,
      signature: '',
      signatureVerified: null,
      resUrl: '',
      resData: {},
    };
  },
  mounted() {
    console.log(this.$hLogin);
    console.log(this.$hStrategies);
    this.generateRequestUrl();
  },
  methods: {
    async generateRequestUrl() {
      this.reqUrl = '';
      this.reqData = {};
      this.reqUrl = await this.$hLogin.generateRequestUrl({
        domain: this.domain,
        challenge: this.challenge,
        callbackUrl: this.callbackUrl,
      });
      this.reqData = await this.$hLogin.parseRequestDataFromUrl(this.reqUrl);
    },
    async getDeviceRecord() {
      this.deviceId = await this.$hLogin.getDeviceId();
      this.prefix = await this.$hLogin.getPrefix();
      this.deviceInfo = await this.$hLogin.getDeviceRecord();
    },
    async getIdentity(forceGenerate = false) {
      if (!forceGenerate && this.deviceInfo) {
        this.identity = await this.$hLogin.getIdentity();
      } else {
        this.identity = await this.$hLogin.generateIdentity();
      }
      this.dnsRecord = await this.$hLogin.generateDnsRecord();
    },
    async verifyIdentity() {
      if (!this.deviceInfo) {
        this.identityVerified = false;
        return;
      }
      this.identityVerified = await this.$hLogin.verifyFingerprintWithDNS();
    },
    async registerIdentity() {
      this.dnsRecord = await this.$hLogin.generateDnsRecord();
      this.txtRecord = `${this.dnsRecord.name}  IN  TXT  "${this.dnsRecord.value}"`;
    },
    async loginIdentity() {
      this.signature = await this.$hLogin.sign();
      this.resUrl = await this.$hLogin.generateResponseUrl();
      this.resData = await this.$hLogin.parseResponseDataFromUrl(this.resUrl);
    },
    async verifySignature() {
      this.resData = await this.$hLogin.parseResponseDataFromUrl(this.resUrl); // REMOVE LATER
      this.signatureVerified = await this.$hLogin.verify(this.challenge);
    },
  },
  watch: {
    selectedStrategy() {
      if (this.selectedStrategy.name) {
        this.$hLogin.useStrategy(new this.selectedStrategy.strategy());
      }
    },
  },
};
</script>
