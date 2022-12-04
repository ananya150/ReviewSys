import './App.css';
import { WorldIDWidget } from '@worldcoin/id';
import { defaultAbiCoder as ABI } from 'ethers/lib/utils';
import { useState } from 'react';
import verify from './verify.png';
import MainABI from './Main.json';

import ProgressBar from '@ramonak/react-progress-bar';

function App() {
	const Web3 = require('web3');
	const [wallet_status, set_wallet_status] = useState('Connect Wallet');
	const [account, set_account] = useState('');
	const [chain_id, set_chain_id] = useState('');
	const [network_status, set_network_status] = useState('Not Connected');
	const [rating, setRating] = useState('');
	const [review, setReview] = useState('');
	const { ethereum } = window;
	const [verification, setVerification] = useState();

	const len = 50;

	const networks = {
		'0x1': 'ETH Mainnet',
		'0x89': 'Polygon',
		'0x3': 'Ropsten',
		'0x2a': 'Kovan',
		'0x4': 'Rinkeby',
		'0x5': 'Goerli',
		'0x13881': 'Mumbai',
	};

	function handleVerification(verification) {
		console.log(verification);

		let { merkle_root, nullifier_hash, proof } = verification;
		let depackedProof = ABI.decode(['uint256[8]'], proof)[0];
		console.log(depackedProof);
		setVerification({ merkle_root, nullifier_hash, depackedProof });
	}

	async function handleConnect(new_account) {
		set_account(new_account);
		document.getElementById('input_address').value = new_account;
		set_wallet_status(
			'Connected as ' +
				new_account.substring(0, 6) +
				'...' +
				new_account.slice(-4)
		);
		let connected_chain = await ethereum.request({ method: 'eth_chainId' });
		set_chain_id(connected_chain);
		set_network_status(
			'Connected to: ' + (networks[connected_chain] || connected_chain)
		);
		ethereum.on('chainChanged', (_chainId) => window.location.reload());
		console.log(connected_chain);
	}

	async function connectWallet() {
		try {
			let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			handleConnect(accounts[0]);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleQuery() {
		let query_address = document.getElementById('input_address').value;
		fetch(
			`https://api.covalenthq.com/v1/1/address/${query_address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_79c997c7e8084e0f9df0af9824c`
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(data.data.items);
			});
	}

	async function submitFB() {
		let metamask_web3 = new Web3(window.ethereum);
		let sol_contract = new metamask_web3.eth.Contract(
			MainABI,
			'0xEaca71D31dA81962dED284Aea32881d57D658BD9'
		);

		// let { merkle_root, nullifier_hash, depackedProof } = verification;

		const devaansh = await sol_contract.methods.giveReview(
			document.getElementById('review').toString(),
			document.getElementById('rating')
		);
		console.log(devaansh);
		// .send({ from: account, gas: 3000000 });
	}

	async function handleTransaction() {
		// eslint-disable-next-line no-undef
		let metamask_web3 = new Web3(window.ethereum);
		let metamask_contract = new metamask_web3.eth.Contract(
			MainABI,
			'0xEaca71D31dA81962dED284Aea32881d57D658BD9'
		);

		let { merkle_root, nullifier_hash, depackedProof } = verification;
		await metamask_contract.methods
			.verifyAndExecute(
				account,
				merkle_root,
				nullifier_hash,
				depackedProof,
				document.getElementById('input_address')
			)
			.send({ from: account, gas: 3000000 });
	}

	window.onload = async function () {
		if (typeof window.ethereum !== 'undefined') {
			let accounts = await ethereum.request({ method: 'eth_accounts' });
			if (accounts.length) {
				handleConnect(accounts[0]);
			}
		}
	};

	return (
		<div>
			<div id='connect_wallet' onClick={connectWallet}>
				<span id='connect_wallet_text'>{wallet_status}</span>
			</div>

			<div id='container'>
				<div id='search'>
					<input
						type='text'
						id='input_address'
						placeholder='Enter an address'
					></input>
					<button id='address_search' onClick={handleQuery}>
						Search
					</button>
				</div>

				<div id='world_id_widget_wrapper'>
					<WorldIDWidget
						actionId='wid_c6524a2aa175ef61ddf618fd1d0559ac'
						signal='sign-in'
						onSuccess={(verificationResponse) =>
							handleVerification(verificationResponse)
						}
						onError={(error) => console.error(error)}
						debug={true}
					/>
				</div>
				<button id='verify_button' onClick={handleTransaction}>
					<img id='verify_image' src={verify} alt='check' />
					Verify ENS
				</button>
			</div>
			<div id='review-contain'>
				<p id='string'>Please enter a review with the rating (out of 10) : </p>
				<input
					type='number'
					id='rating'
					placeholder='Enter a rating...'
				></input>
				<input type='text' id='review' placeholder='Enter a review...'></input>
				<button id='review-submit' onClick={submitFB}>
					Submit
				</button>
			</div>

			<div id='len'>
				<ProgressBar completed={len} />
			</div>
		</div>
	);
}

export default App;
