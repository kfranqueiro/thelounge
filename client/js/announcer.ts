/**
 * Wrapper around @vue-a11y/announcer's useAnnouncer to add multiple features:
 * - Clear the live region on a timeout to avoid AT stumbling across an old announcement later
 * - Allow turning off announcements (e.g. for state changes during initial setup)
 */

import {useAnnouncer as useOriginalAnnouncer} from "@vue-a11y/announcer";

import {UseAnnouncerReturn} from "@vue-a11y/announcer/dist/types";

let isActive = true;
let timer: ReturnType<typeof setTimeout> | null = null;

interface ExtendedUseAnnouncerReturn extends UseAnnouncerReturn {
	activate: () => void;
	deactivate: () => void;
}

export function useAnnouncer(): ExtendedUseAnnouncerReturn {
	const {announce: originalAnnounce, ...rest} = useOriginalAnnouncer();

	function announce(message, politeness) {
		if (!isActive) {
			return;
		}

		if (timer) {
			clearTimeout(timer);
		}

		originalAnnounce(message, politeness);
		timer = setTimeout(() => {
			originalAnnounce("", politeness);
			timer = null;
		}, 3000);
	}

	return {
		...rest,
		activate() {
			isActive = true;
		},
		deactivate() {
			isActive = false;
		},
		announce,
		assertive: (message) => announce(message, "assertive"),
		polite: (message) => announce(message, "polite"),
	};
}
