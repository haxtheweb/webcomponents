var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="paper-contact-shared-styles">
	<template>
		<style>
			:host {
				@apply --layout-vertical;
			}

			.item {
				cursor: pointer;
			}

			.icon {
				color: var(--disabled-text-color);
			}

			.text {
				padding-top: 14px;
				padding-bottom: 14px;
				white-space: pre-wrap;
				@apply --paper-font-body1;
			}
		</style>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer);
