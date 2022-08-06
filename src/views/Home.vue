<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen px-8 mx-auto text-center"
  >
    <h1 class="text-3xl font-bold">hTools ID Manager</h1>
    <p class="mt-6 text-lg">
      Uses
      <a
        href="https://github.com/htools-org/handshake-login"
        class="font-mono font-light underline"
        >handshake-login</a
      >
      to allow authenticating wih any handshake name you own with DNS.
    </p>
    <p class="mt-4 text-lg">
      A drop-in replacement for Namebase's ID Manager.<br />
      Built from scrach to support multiple strategies.
    </p>

    <p class="mt-12">Simply set this DNS record:</p>
    <div
      class="w-full max-w-md p-3 mx-auto mt-4 overflow-x-auto font-mono text-left whitespace-pre bg-gray-800 rounded"
    >
      {{ dnsRecordString }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  computed: {
    dnsRecordString() {
      return `Type:  TXT
Name:  _idmanager
Value: v=0;url=https://id.htools.work`;
    },
  },
};
</script>
