import { html, css, LitElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { updateMetadata } from 'pwa-helpers/metadata';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { router } from '../routes';

//importing the actions required by this app
import {
	navigate,
	updateDrawerState,
	toggleAccountSelector,
	toggleDrawer,
	updateDrawerLayout
} from '../actions/app'
import { store } from '../store';

//importing web components used on this page
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/paper-menu-button';
import '@polymer/paper-button';
import '../components/drawer-page-list';
import '../components/view-container';
import '../components/drawer-account-list';
import '../components/paper-badge';
import '../components/notifications-button';

import { menuIcon, dropDownIcon, dropUpIcon } from '../components/icons';

//the main custom element
class TodoApp extends connect(store)(LitElement) {

	static get styles () {
		return css`
			:host {
				display: block;
				min-height: 100vh;
				background: #f8f9fa;

				--app-primary-color: #039be5;
				--secondary-color: #4caf50;

				--app-light-background: #424242;
				--app-medium-background: #303030;
				--app-dark-background: #212121;

				--app-light-text-color: white;
				--app-dark-text-color: black;

				--app-header-background-color: var(--app-primary-color);
				--app-header-text-color: var(--app-light-text-color);

				--app-drawer-header-background: url('/img/background-light.svg');
				--app-drawer-background-color: white;
				--app-drawer-text-color: var(--app-dark-text-color);
				--drawer-divider-color: #e0e0e0;
				--app-drawer-width: 290px	;

				--page-list-selected-color: var(--app-primary-color);
				--page-list-color: var(--app-dark-text-color);
				--page-list-icon-color: #757575;
				--account-list-icon-color: #757575;

				--notification-dropdown-primary-color: var(--app-primary-color);
			}

			:host([theme="dark"]) {
				background: var(--app-medium-background);
				--app-primary-color: #7e57c2;

				--app-header-background-color: var(--app-dark-background);
				--app-header-text-color: var(--app-light-text-color);

				--app-drawer-text-color: var(--app-light-text-color);
				--app-drawer-header-background: url('/img/background-dark.svg');
				--app-drawer-background-color: var(--app-dark-background);
				--drawer-divider-color: var(--app-medium-background);

				--page-list-selected-color: var(--app-primary-color);
				--page-list-color: var(--app-light-text-color);
				--page-list-icon-color: var(--app-light-text-color);

				--notification-dropdown-content-color:  var(--app-light-text-color);
				--notification-dropdown-content-secondary-color: var(--app-light-text-color);
				--notification-dropdown-content-background: var(--app-light-background);
			}

			[hidden] {
				display: none;
			}

			app-header-layout ::content #contentContainer {
				z-index: 10!important;
			}

			app-header {
				background: var(--app-header-background-color);
				color: var(--app-header-text-color);
			}

			app-toolbar {
				justify-content: space-between;
			}

			app-toolbar svg {
				fill: var(--app-header-text-color);
			}

			#left-header-container {
				display: flex;
			}

			.icon-btn {
				min-width: 0;
				min-height: 0;
				border-radius: 50%;
				height: 48px;
				width: 48px;
			}

			[main-title] {
				font-weight: 500;
				font-size: 26px;
				line-height: 48px;
				margin: 0;
				margin-left: 5px;
			}

			#menu-btn svg {
				width: 24px;
				height: 24px;
			}

			button {
				background: none;
				border: none;
				cursor: pointer;
			}

			button:focus {
				outline: none;
			}

			#drawer-content {
				background: var(--app-drawer-background-color);
				color: var(--app-drawer-text-color);
				height: 100%;
				user-select: none;
				border-right: 1px solid var(--drawer-divider-color);
			}

			#drawer-header {
				padding: 0 15px 18px 15px;
				border-bottom: 1px solid var(--drawer-divider-color);
				cursor: pointer;
				background: var(--app-drawer-header-background);
				background-size: cover;
				color: white;
			}

			#profile-picture-container {
				display: flex;
				align-items: center;
				height: 133px;
			}

			#drawer-header h2 , p {
				margin: 0;
			}

			#account-selection-indicator {
				float: right;
				position: relative;
				top: -30px;
				fill: currentColor;
			}

			.avatar-big {
				width: 60px;
				height: 60px;
				background-size: cover;
				background-position: center;
				border-radius: 50%;
				display: inline-block;
			}

			drawer-page-list {
				margin-top: 3 px;
			}

			view-container {
				width: 100%;
			}

			@media (min-width: 377.8px) {
        :host {
          --app-drawer-width: 340px;
        }
			}

			@media (min-width: 1151px) {
				#menu-btn {
					display: none;
				}
			}
		`
	}

	render() {
		return html`
			<app-drawer-layout .responsiveWidth="${"1150px"}" .forceNarrow="${!this._page.drawer}">

				<app-drawer
					?hidden="${!this._page.drawer}"
					slot="drawer"
					.opened="${this._drawerOpened}"
					@opened-changed=${this._drawerOpenedChanged}>
					<div id="drawer-content">
						<div id="drawer-header" @click="${() => store.dispatch(toggleAccountSelector)}">
							<div id="profile-picture-container">
								<div class="avatar avatar-big" style="background-image: url('/img/avatars/128_6.jpg')"></div>
							</div>
							<h2>George Johnson</h2>
							<p>george.johnson@gmail.com</p>
							<div id="account-selection-indicator">
								${this._accountSelectorOpened? dropUpIcon: dropDownIcon}
							</div>
						</div>
						<drawer-page-list .pages="${this._pages}" .page="${this._page.id}" ?hidden="${this._accountSelectorOpened}"></drawer-page-list>
						<drawer-account-list .accounts="${this._accounts}" ?hidden="${!this._accountSelectorOpened}"></drawer-account-list>
					</div>
				</app-drawer>

				<app-header-layout>
					<app-header condenses reveals effects="waterfall" slot="header" ?hidden="${!this._page.header}">
						<app-toolbar>
							<div id="left-header-container">
								<paper-button id="menu-btn" class="icon-btn" @click="${this._menuButtonClicked}">
									${menuIcon}
								</paper-button>
								<h1 main-title>${this._page.title}</h1>
							</div>
							<div id="right-header-container">
								<notifications-button></notifications-button>
							</div>
						</app-toolbar>
					</app-header>

					<view-container .page="${this._page}"></view-container>
				</app-header-layout>
			</app-drawer-layout>
		`
	}

	_menuButtonClicked() {
		store.dispatch(toggleDrawer());
	}

	_drawerOpenedChanged(e) {
		store.dispatch(updateDrawerState(e.target.opened));
	}

	firstUpdated() {
		router.addEventListener('pagechange', e => {
			store.dispatch(navigate(e.page));
		})
		store.dispatch(navigate(router.activePage));
		installMediaQueryWatcher('(max-width: 1150px)', match => store.dispatch(updateDrawerLayout(match)));
	}

	updated(changedProps) {
		if(changedProps.has('_page')) {
			updateMetadata({
				title: `Todo App - ${this._page.title}`,
				description: this._page.title
			})
		}
	}

	static get properties () {
		return {
			_page: Object,
			_pages: Object,
			_drawerOpened: Boolean,
			_accountSelectorOpened: Boolean
		}
	}

	stateChanged(state) {
		this._page = state.app.page;
		this._pages = state.app.pages;
		this._drawerOpened = state.app.drawerOpened;
		this._accountSelectorOpened = state.app.accountSelectorOpened;
		this._accounts = [
			{
				name: 'Jack Benton',
				email: 'jackyboii@gmail.com',
				avatar: '/img/avatars/128_10.jpg'
			},
			{
				name: 'Bli A',
				email: 'youwotm9@gmail.com',
				avatar: '/img/avatars/128_8.jpg'
			},
			{
				name: 'Katie Jackson',
				email: 'the.kate.1993@gmail.com',
				avatar: '/img/avatars/128_9.jpg'
			}
		]
	}

}

customElements.define('todo-app', TodoApp);