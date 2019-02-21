import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import Main from './src/js/pages/0_main/Main';
import Login from './src/js/pages/1_login/Login';
import Join from './src/js/pages/2_join/Join';
import Play from './src/js/pages/3_play/Play';
import Chat from './src/js/pages/4_chat/Chat';
export default (App = () => {
	return (
		<Router tabs={false}>
			<Scene key="root" hideNavBar={true}>
				<Scene key="main" path="/" component={Main} type={ActionConst.REPLACE} />
				<Scene key="login" path="/login" component={Login} type={ActionConst.REPLACE} />
				<Scene key="join" path="/join" component={Join} type={ActionConst.REPLACE} />
				<Scene key="play" path="/play" component={Play} type={ActionConst.REPLACE} />
				<Scene key="chat" path="/chat" component={Chat} type={ActionConst.REPLACE} />
			</Scene>
		</Router>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

console.disableYellowBox = true;
console.ignoredYellowBox = true;
// console.ignoredYellowBox = [ 'Remote debugger' ];
YellowBox.ignoreWarnings([
	'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
