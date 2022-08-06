<template>
  <div class="min-h-screen text-center py-16 sm:pt-[10vh]">
    <h4 class="text-lg font-light sm:text-2xl">login as</h4>
    <h3 class="mt-4 font-mono text-xl font-medium sm:text-3xl">
      {{ domain }}/
    </h3>

    <!-- Invalid Request -->
    <div
      v-if="invalidRequestData"
      class="max-w-xs px-3 py-2 mx-auto mt-6 text-lg text-center text-red-800 bg-red-200 rounded cursor-pointer"
      @click="$router.go(-1)"
    >
      Invalid Request.<br />
      Click here to go back.
    </div>

    <section
      v-if="!invalidRequestData"
      class="grid w-4/5 max-w-4xl gap-4 mx-auto mt-10 text-left sm:grid-cols-2"
    >
      <div
        v-for="strategy in $hStrategies"
        :key="strategy"
        class="w-full p-2 mx-auto border-2 border-indigo-400 rounded-md cursor-pointer sm:p-4 sm:w-max"
        :class="{
          'opacity-50': loggingIn,
          'bg-indigo-600 border-white': strategy.name === selectedStrategy.name,
        }"
        @click="login(strategy)"
      >
        <span class="font-medium">{{
          strategyDisplayName(strategy.name)
        }}</span>
        <p class="text-xs font-light sm:text-sm sm:mt-2">
          {{ strategySubtext(strategy.name) }}
        </p>
      </div>
    </section>

    <p
      v-if="!invalidRequestData && !selectedStrategy.name"
      class="mt-16 text-xl font-light"
    >
      pick a strategy above
    </p>

    <!-- Steps -->
    <section class="my-16" v-if="selectedStrategy.name">
      <ul class="flex justify-center max-w-4xl mx-auto">
        <li
          v-for="(step, idx) in steps"
          :key="idx"
          :data-num="idx + 1 === currentStep ? '🚀' : idx + 1"
          class="relative flex-1 z-0 opacity-40 before:w-8 before:h-8 before:flex before:items-center before:justify-center before:mb-2 before:mx-auto before:border before:rounded-full before:bg-indigo-900 before:content-[attr(data-num)] before:z-[-1] after:z-[-1] after:absolute after:w-3/5 after:-left-1/3 after:h-0.5 after:top-4 after:bg-white first-of-type:after:hidden"
          :class="{ '!opacity-100': idx + 1 <= currentStep }"
        >
          {{ step }}
        </li>
      </ul>
    </section>

    <!-- Identity (Password) -->
    <section
      v-if="
        currentStep === 3 &&
        selectedStrategy.name === 'LocalStorageStrategy' &&
        askForPassword &&
        !loggingIn
      "
      class="max-w-4xl mx-auto"
    >
      <p>
        Enter the password to unlock the local store.<br />
        Give a new one if you haven't set a password on this device already.
      </p>
      <div class="mt-8">
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="px-4 py-2 bg-indigo-700 border border-indigo-800 rounded-md placeholder-indigo-50/70"
          @keypress.enter="login()"
          autofocus
        />
        <button class="py-2 pl-6 font-medium" @click="login()">GO</button>
      </div>
    </section>

    <!-- Add DNS Record -->
    <section
      v-if="
        currentStep === 3 &&
        !loggingIn &&
        !askForPassword &&
        showAddDeviceRecordInfo
      "
      class="max-w-4xl mx-auto"
    >
      <p>
        This device isn’t registered yet.<br />
        Add this DNS record to prove ownership.<br /><br />
      </p>
      <p class="mt-2 text-sm font-light">
        If you have added the record, but still seeing this page,<br />
        <a
          @click="redirectToSelfWithSkipDnsCheck"
          class="underline cursor-pointer"
          >click here to skip the check</a
        >.
      </p>
      <div class="grid justify-center gap-12 mt-8 sm:grid-cols-2">
        <!-- Namebase -->
        <div class="px-4">
          <img
            src="@/assets/images/namebase_wordmark_white.png"
            alt="Namebase"
            class="h-6 mx-auto"
          />
          <p class="mx-auto mt-3 sm:mt-6">
            Click here to add the record to Namebase DNS
          </p>
          <button
            class="px-4 py-2 mt-4 bg-indigo-600 rounded"
            @click="redirectToNamebase"
          >
            Add Record
          </button>
        </div>

        <!-- Others -->
        <div class="px-4 overflow-hidden">
          <p class="text-xl font-bold">Others</p>
          <p class="mx-auto mt-2 sm:mt-5">
            Add this TXT record where you manage DNS
          </p>
          <div
            class="w-full p-3 mx-auto mt-4 overflow-x-auto font-mono text-left whitespace-pre bg-gray-800 rounded"
          >
            {{ dnsRecordString }}
          </div>
        </div>
      </div>
    </section>

    <!-- Success - Redirect -->
    <section v-if="currentStep === 4">
      <p class="text-lg">Success!</p>
      <button
        class="px-4 py-2 mt-4 bg-indigo-600 rounded"
        @click="redirectToCallbackUrl"
      >
        Back to App
      </button>
    </section>

    <!-- Error Message -->
    <div
      v-if="errorMsg"
      class="max-w-xs px-3 py-1 mx-auto mt-6 text-center text-red-800 bg-red-200 rounded"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  inject: ['$hLogin', '$hStrategies'],
  components: {},
  data() {
    return {
      domain: '...',
      selectedStrategy: {},
      loggingIn: false,
      invalidRequestData: false,
      steps: ['Device Info', 'DNS Record', 'Identity', 'Login'],
      currentStep: 0,
      dnsRecordToAdd: null,
      responseUrl: null,
      password: '',
      askForPassword: false,
      showAddDeviceRecordInfo: false,
      errorMsg: null,
    };
  },
  mounted() {
    try {
      const reqData = this.$hLogin.parseRequestDataFromUrl();
      this.domain = reqData.domain;
    } catch (error) {
      console.error(error);
      this.invalidRequestData = true;
    }
  },
  methods: {
    async login(strategy = null) {
      this.loggingIn = true;
      this.askForPassword = false;
      this.showAddDeviceRecordInfo = false;
      this.currentStep = 0;
      this.errorMsg = null;
      if (strategy) this.password = '';

      try {
        this.currentStep = 1;
        if (strategy) {
          this.selectedStrategy = strategy;
          await this.$hLogin.useStrategy(new this.selectedStrategy.strategy());
        }
        try {
          console.log('Device ID:', await this.$hLogin.getDeviceId());
        } catch (error) {
          console.error(error);
          throw new Error('Could not get device id: ' + error.message);
        }

        this.currentStep = 2;
        let deviceRecord;
        try {
          deviceRecord = await this.$hLogin.getDeviceRecord();
          // deviceRecord = null;
          console.log('Device DNS Record:', deviceRecord);
        } catch (error) {
          console.error(error);
          throw new Error('Could not fetch DNS Record: ' + error.message);
        }

        this.currentStep = 3;
        if (this.selectedStrategy.name === 'LocalStorageStrategy') {
          if (!this.password.length) {
            this.askForPassword = true;
            return;
          }
          this.$hLogin.strategy.strategyOptions = { password: this.password };
        }

        if (window.location.href.includes('skipdnscheck')) {
          if (!this.$hLogin.strategy.deviceRecord)
            this.$hLogin.strategy.deviceRecord = {};
          this.$hLogin.strategy.deviceRecord.keyId = window.sessionStorage.getItem(
            'id-manager:keyId'
          );
          this.$hLogin.strategy.deviceRecord.pubKey = window.sessionStorage.getItem(
            'id-manager:pubKey'
          );
          window.sessionStorage.removeItem('id-manager:keyId');
          window.sessionStorage.removeItem('id-manager:pubKey');
        }

        let identity;
        try {
          identity = await this.$hLogin.getIdentity();
          console.log('Identity:', identity);
        } catch (error) {
          console.error(error);
          throw new Error('Could not get identity: ' + error.message);
        }

        const isNewIdentity = !identity;
        if (!identity) {
          try {
            identity = await this.$hLogin.generateIdentity();
          } catch (error) {
            console.error(error);
            throw new Error(
              'Could not generate new identity: ' + error.message
            );
          }
          window.sessionStorage.setItem('id-manager:keyId', identity.keyId);
          window.sessionStorage.setItem(
            'id-manager:pubKey',
            identity.publicKey
              .replace(/\n?-{5}\n?[\w\s]+\n?-{5}\n?/g, '')
              .replace(/=+$/g, '')
          );
        }

        if (!window.location.href.includes('skipdnscheck')) {
          if (
            isNewIdentity ||
            !deviceRecord ||
            !(await this.$hLogin.verifyFingerprintWithDNS())
          ) {
            // Register or wait.
            try {
              this.dnsRecordToAdd = await this.$hLogin.generateDnsRecord();
            } catch (error) {
              console.error(error);
              throw new Error(
                'Could not generate DNS record: ' + error.message
              );
            }
            this.showAddDeviceRecordInfo = true;
            return;
          }
        }

        this.currentStep = 4;
        try {
          this.responseUrl = await this.$hLogin.generateResponseUrl();
          console.log('Response URL:', this.responseUrl);
        } catch (error) {
          console.error(error);
          throw new Error('Could not generate response url: ' + error.message);
        }
      } catch (error) {
        this.errorMsg = error.message;
      } finally {
        this.loggingIn = false;
      }
    },
    async alternativeRecordCheck() {
      // const alternateCheck = await this.alternativeRecordCheck();
      // console.log('alternateCheck', alternateCheck);

      const url = new URL('https://oidc.namebase.io/validate');
      url.searchParams.append('id', btoa(this.domain));
      url.searchParams.append('deviceId', btoa(this.$hLogin.prefix));
      url.searchParams.append('fp', btoa(this.$hLogin.identity.fingerprint));
      const response = await (await fetch(url.toString())).json();
      return response.success || false;
    },
    redirectToSelfWithSkipDnsCheck() {
      window.location.href += '&skipdnscheck';
      this.login();
    },
    redirectToNamebase() {
      window.location.href = this.namebaseRecordAssistantUrl;
    },
    redirectToCallbackUrl() {
      window.location.href = this.responseUrl;
    },
    strategyDisplayName(strategyName) {
      return (
        {
          LocalStorageStrategy: 'Local Storage',
          WebAuthnStrategy: 'WebAuthn / FIDO 2.0',
        }[strategyName] ?? strategyName
      );
    },
    strategySubtext(strategyName) {
      return (
        {
          LocalStorageStrategy: 'Your keys are stored in this browser',
          WebAuthnStrategy: 'Use security keys (YubiKey, Titan, etc.)',
        }[strategyName] ?? 'No description'
      );
    },
  },
  computed: {
    dnsRecordString() {
      if (!this.dnsRecordToAdd?.type) return 'Loading...';
      return `Type:  ${this.dnsRecordToAdd.type}
Name:  ${this.dnsRecordToAdd.name}
Value: ${this.dnsRecordToAdd.value}`;
    },
    namebaseRecordAssistantUrl() {
      if (this.dnsRecordToAdd) {
        const records = [
          {
            type: this.dnsRecordToAdd.type,
            host: this.dnsRecordToAdd.name.substring(
              0,
              this.dnsRecordToAdd.name.length - this.domain.length - 2
            ),
            value: this.dnsRecordToAdd.value,
            ttl: 5,
          },
        ];
        const url = new URL(
          `https://namebase.io/next/domain-manager/${this.domain}/records`
        );
        url.searchParams.append('records', btoa(JSON.stringify(records)));
        url.searchParams.append(
          'redirect',
          encodeURIComponent(
            encodeURIComponent(window.location.href + '&skipdnscheck')
          )
        );
        return url.toString();
        // return `https://namebase.io/next/domain-manager/${this.domain}/records?records=${recordsEncoded}&redirect=${currentUrl}`;
      }
      return null;
    },
  },
};
</script>
