import React, { useState } from 'react';
import './App.css';
import { event } from './interface';
import MyDatePicker from './MyDatePicker/MyDatePicker';

const events: event[] = [
	{
		date: '2021-09-14',
		event: 'خدا لعنتت کنه احسان',
		isHoliday: true,
	},
	{
		date: '2021-08-15',
		event: 'خدا لعنتت کنه احسان',
		isHoliday: false,
	},
];

const App = () => {
	function onChange(value: any): void {
		setValue({
			to: new Date(value.to).toLocaleDateString(locale),
			from: new Date(value.from).toLocaleDateString(locale),
		});
	}
	const [locale, setLocale] = useState<'fa' | 'en'>('en');
	const [value, setValue] = useState<{ to: any; from: any }>({
		to: null,
		from: null,
	});
	const [visible, setVisible] = useState(false);
	const changeLocalHandler = () => {
		setLocale(locale === 'en' ? 'fa' : 'en');
	};
	return (
		<div className="App">
			<div className="container">
				<div className="mdp-input" onClick={() => setVisible((prev) => !prev)}>
					<input value={value.from ? value.from : ''} />
					<input value={value.to ? value.to : ''} />
				</div>
				{visible && (
					<div className="datePicker-container">
						<div className="datePicker-header">
							<span>تهران-کوالالامپور</span>
							<div>
								<input
									id="calendarName"
									checked={locale === 'en' ? true : false}
									type="checkbox"
									onChange={changeLocalHandler}
								/>
								<label htmlFor="calendarName">تقویم میلادی</label>
							</div>
						</div>
						<MyDatePicker
							events={events}
							onChange={onChange}
							locale={locale}
							onLocaleChange={changeLocalHandler}
							type="range"
							doubleMonth={true}
							showDatePicker={visible}
						/>
						<div className="footer">
							<div className="time ">
								<span>رفت</span>
								<div>
									<span>fdsf</span>
									<span>fsdfsdf</span>
								</div>
							</div>
							<div className="time ">
								<span>رفت</span>
								<div>
									<span>fdsf</span>
									<span>fsdfsdf</span>
								</div>
							</div>
							<button>تایید</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
