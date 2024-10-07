<template>
	<li :aria-label="name" aria-controls="settings">
		<router-link :to="'/settings/' + to" :class="['icon', className]">
			{{ name }}
		</router-link>
	</li>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";

export default defineComponent({
	name: "SettingTabListItem",
	props: {
		name: {
			type: String,
			required: true,
		},
		className: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
	},
	setup() {
		const route = useRoute();

		return {
			route,
		};
	},
});
</script>
