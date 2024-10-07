<template>
	<ChannelWrapper v-bind="$props" :channel="channel">
		<button
			v-if="network.channels.length > 1"
			:aria-controls="'network-' + network.uuid"
			:aria-label="getExpandLabel(network)"
			:aria-expanded="!network.isCollapsed"
			class="collapse-network tooltipped tooltipped-e"
			@click.stop="onCollapseClick"
		>
			<span class="collapse-network-icon" />
		</button>
		<span v-else class="collapse-network" />
		<router-link class="lobby-wrap" :to="`/chan-${channel.id}`">
			<span :title="channel.name" class="name">{{ channel.name }}</span>
			<span
				v-if="network.status.connected && !network.status.secure"
				class="not-secure-tooltip tooltipped tooltipped-w"
				aria-label="Insecure connection"
			>
				<span class="not-secure-icon" />
			</span>
			<span
				v-if="!network.status.connected"
				class="not-connected-tooltip tooltipped tooltipped-w"
				aria-label="Disconnected"
			>
				<span class="not-connected-icon" />
			</span>
			<span v-if="channel.unread" :class="{highlight: channel.highlight}" class="badge">{{
				unreadCount
			}}</span>
		</router-link>
		<button
			class="add-channel-tooltip tooltipped tooltipped-w tooltipped-no-touch"
			:aria-controls="'join-channel-' + channel.id"
			:aria-expanded="isJoinChannelShown"
			:aria-label="joinChannelLabel"
			@click.stop="$emit('toggle-join-channel')"
		>
			<div :class="['add-channel', {opened: isJoinChannelShown}]" />
		</button>
	</ChannelWrapper>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import collapseNetwork from "../js/helpers/collapseNetwork";
import roundBadgeNumber from "../js/helpers/roundBadgeNumber";
import ChannelWrapper from "./ChannelWrapper.vue";

import type {ClientChan, ClientNetwork} from "../js/types";

export default defineComponent({
	name: "Channel",
	components: {
		ChannelWrapper,
	},
	props: {
		network: {
			type: Object as PropType<ClientNetwork>,
			required: true,
		},
		isJoinChannelShown: Boolean,
		active: Boolean,
		isFiltering: Boolean,
	},
	emits: ["toggle-join-channel"],
	setup(props) {
		const channel = computed(() => {
			return props.network.channels[0];
		});

		const joinChannelLabel = computed(() => {
			return props.isJoinChannelShown ? "Cancel" : "Join a channel…";
		});

		const unreadCount = computed(() => {
			return roundBadgeNumber(channel.value.unread);
		});

		const onCollapseClick = () => {
			collapseNetwork(props.network, !props.network.isCollapsed);
		};

		const getExpandLabel = (network: ClientNetwork) => {
			return `${network.isCollapsed ? "Expand" : "Collapse"} chats in network`;
		};

		return {
			channel,
			joinChannelLabel,
			unreadCount,
			onCollapseClick,
			getExpandLabel,
		};
	},
});
</script>
