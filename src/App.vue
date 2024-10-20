<script setup>
import MailView from './components/MailView.vue'
import { accounts, mails } from './mails.js'
</script>

<template>
	<MailView :accounts="accounts" :mails="mails" />
</template>
