import React, { useEffect, useState } from "react";

const Home = () => {
	const [bitData, setBitData] = useState([]);
	const [webSocket, setWebSocket] = useState(null);

	const openConnection = () => {
		const w = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
		w.onopen = () => {
			console.log("WebSocket Client Connected");

			let msg = JSON.stringify({
				event: "subscribe",
				channel: "ticker",
				symbol: "tBTCUSD",
			});

			w.send(msg);
			setWebSocket(w);
		};

		w.onmessage = function (e) {
			console.log("Data", JSON.parse(e.data));
			let Data = JSON.parse(e.data);
			if (Data[1] !== "hb") {
				setBitData(Data);
			}
		};

		w.onerror = function () {
			console.log("Connection Error");
		};
	};

	useEffect(() => {
		let interval = setInterval(() => {
			if (navigator.onLine) {
				console.log("online");
			} else {
				console.log("offline");
				closeConnection();
			}
		}, 2000);

		return () => {
			clearInterval(interval);
			setWebSocket(null);
		};
	}, []);

	const closeConnection = () => {
		if (!webSocket) return;

		if (webSocket.readyState !== WebSocket.CLOSED) {
			webSocket.close();
			setBitData([]);
			console.log("echo-protocol Client Closed");
		}
	};

	return (
		<>
			<div className='p-4'>
				<button
					type='button'
					className='themeButton connectButton'
					onClick={(e) => openConnection(e)}>
					Connect
				</button>
				<button
					type='button'
					className='themeButton connectButton ml-4'
					onClick={(e) => closeConnection(e)}>
					Disconnect
				</button>
			</div>

			<div className=' d-flex justify-content-center mt-5'>
				<div className='card w-100'>
					<div className='card-body'>
						{bitData.length > 0 ? (
							<div className='d-flex justify-content-between'>
								<div className='d-flex flex-row p-0 justify-content-center align-items-center'>
									<div className='icon'>
										<i className='bi bi-currency-bitcoin' />
									</div>

									<div className='d-flex flex-column p-0 justify-content-start align-items-start'>
										<p>BTC/USD</p>
										<p>
											VOL &nbsp;{bitData[1] && bitData[1][7].toFixed(2)}{" "}
											<u>BTC</u>{" "}
										</p>
										<p>LOW &nbsp;{bitData[1] && bitData[1][9].toFixed(2)}</p>
									</div>
								</div>
								<div className='d-flex flex-column p-0 justify-content-center align-items-center'>
									<p>{bitData[1] && bitData[1][0]}</p>

									<p className='green'>
										{bitData[1] && bitData[1][4].toFixed(2)} &nbsp;
										<i className='bi bi-caret-up-fill' /> (
										{(bitData[1] && bitData[1][5].toFixed(2)) * 100}%)
									</p>

									<p>HIGH &nbsp;{bitData[1] && bitData[1][8].toFixed(2)}</p>
								</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
