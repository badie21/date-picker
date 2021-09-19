import React, { useState, useEffect, useRef } from 'react';
import Calendar from '../Calender/index';
import './MyDatePicker.css';
import jmoment from 'moment-jalaali';
import { event } from '../interface';

let todayTimestamp = new Date().setHours(0, 0, 0, 0);
const today = jmoment();

interface MyDatePickerProps {
	locale: 'en' | 'fa';
	onChange: (timeStamp: any) => void;
	onLocaleChange: () => void;
	type?: string;
	events: {
		date: string;
		event: string;
		isHoliday: boolean;
	}[];
	doubleMonth: boolean;
	showDatePicker: boolean;
}

interface MyDatePickerState {
	year: number;
	month: number;
	selectedDay: null | number;
	from: null | number;
	to: null | number;
	hoveredDay: null | number;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
	locale,
	onChange,
	onLocaleChange,
	type,
	events,
	doubleMonth,
	showDatePicker,
}) => {
	let inputRef = useRef();
	const daysMap = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const monthMap = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	/*
		far : March-april
		ord : april-may
		kho: may-june
		tir: june-july
		mor: july-aguest
		sha: aguest-september
		meh: september-october
		aba: october-nobember
		aza: november-decmber 
		day: December-january **** next year
		bah: january-February
		next year ***** esf: february- March
	*/
	const persianMonthToGeorgian = [
		'Mar-Apr',
		'Apr-May',
		'May-Jun',
		'Jun-Jul',
		'Jul-Agu',
		'Agu-Sep',
		'Sep-Oct',
		'Oct-Nov',
		'Nov-Dec',
		'Dec-Jan',
		'Jan-Feb',
		'Feb-Mar',
	];
	const georgianMonthToPersian = [
		'دی-بهمن',
		'بهمن-اسفند',
		'اسفند-فروردین',
		'فروردین-اردیبهشت',
		'اردیبهشت-خرداد',
		'خرداد-تیر',
		'تیر-مرداد',
		'مرداد-شهریور',
		'شهریور-مهر',
		'مهر-آبان',
		'آبان-آذر',
		'آذر-دی',
	];
	const PmonthMap = [
		'فروردین',
		'اردیبهشت',
		'خرداد',
		'تیر',
		'مرداد',
		'شهریور',
		'مهر',
		'آبان',
		'آذر',
		'دی',
		'بهمن',
		'اسفند',
	];
	const [state, setState] = useState<MyDatePickerState>({
		year: locale === 'en' ? today.year() : today.jYear(),
		month: locale === 'en' ? today.month() : today.jMonth(),
		selectedDay: null,
		from: null,
		to: null,
		hoveredDay: null,
	});

	useEffect(() => {
		onChange(state);
	}, [state]);

	useEffect(() => {
		setState((prev) => {
			return {
				...prev,
				year: locale === 'en' ? today.year() : today.jYear(),
				month: locale === 'en' ? today.month() : today.jMonth(),
			};
		});
	}, [locale]);

	useEffect(() => {
		// window.addEventListener('click', addBackDrop);
		// setDateToInput(state.selectedDay);
		// return () => {
		// 	window.removeEventListener('click', addBackDrop);
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// const addBackDrop = (e) => {
	// 	// if (
	// 	// 	state.showDatePicker &&
	// 	// 	!ReactDOM.findDOMNode(this).contains(e.target)
	// 	// ) {
	// 	// 	showDatePicker(false);
	// 	// }
	// };

	/**
	 *  Core
	 */

	const getDayDetails = (args: {
		firstDay: number;
		index: number;
		month: number;
		numberOfDays: number;
		year: number;
	}) => {
		let date = args.index - args.firstDay;
		let day = args.index % 7;
		let prevMonth = args.month - 1;
		let prevYear = args.year;
		if (prevMonth < 0) {
			prevMonth = 11;
			prevYear--;
		}
		let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
		let _date =
			(date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
		let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
		let timestamp =
			locale === 'en'
				? new Date(
						jmoment(args.year + '-' + (args.month + 1) + '-' + _date)
							.format('YYYY-MM-DD')
							.toString()
				  )
				: new Date(
						jmoment(
							args.year + '-' + (args.month + 1) + '-' + _date,
							'jYYYY-jMM-jDD'
						)
							.format('YYYY-MM-DD')
							.toString()
				  );
		return {
			date:
				locale === 'en'
					? jmoment(args.year + '-' + (args.month + 1) + '-' + _date)
					: jmoment(
							args.year + '-' + (args.month + 1) + '-' + _date,
							'jYYYY-jMM-jDD'
					  ),
			day,
			month,
			timestamp: timestamp.setHours(0, 0, 0, 0),
			dayString: daysMap[day],
		};
	};

	const getNumberOfDays = (year: number, month: number): number => {
		return 40 - new Date(year, month, 40).getDate();
	};

	const getDayIndex = (day: string): number => {
		const dayOrder =
			locale === 'fa'
				? ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
				: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return dayOrder.indexOf(day);
	};

	const getFirstDay = (year: number, month: number): number => {
		let dayName =
			locale === 'en'
				? jmoment(`${year}, ${month}, 1`).format('ddd')
				: jmoment(`${year}, ${month}, 1`, 'jYYYY=jMM-jDD').format('ddd');
		return getDayIndex(dayName);
	};

	const getNumberOfDay = (year: number, month: number) => {
		if (locale === 'en') {
			return 40 - new Date(year, month - 1, 40).getDate();
		} else {
			let numberOfDays = month < 7 ? 31 : 30;
			if (month === 12 && !jmoment.jIsLeapYear(year)) {
				numberOfDays = 29;
			}
			return numberOfDays;
		}
	};

	const getMonthDetails = (year: number, month: number) => {
		const firstDay = getFirstDay(year, month + 1);
		let numberOfDays = getNumberOfDay(year, month + 1);

		let monthArray = [];
		let rows = 6;
		let currentDay = null;
		let index = 0;
		let cols = 7;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				currentDay = getDayDetails({
					index,
					numberOfDays,
					firstDay,
					year,
					month,
				});
				monthArray.push(currentDay);
				index++;
			}
		}
		return monthArray;
	};

	const isCurrentDay = (timestamp: number): boolean => {
		return timestamp === new Date(todayTimestamp).setHours(0, 0, 0, 0);
	};

	const isSelectedDay = (timestamp: number): boolean => {
		return timestamp === state.selectedDay;
	};

	// const getDateFromDateString = (dateValue: string) => {
	// 	let dateData = dateValue.split('-').map((d) => parseInt(d, 10));
	// 	if (dateData.length < 3) return null;
	// 	let year = dateData[0];
	// 	let month = dateData[1];
	// 	let date = dateData[2];
	// 	return { year, month, date };
	// };

	const getMonthStr = (month: number) => {
		return {
			monthName:
				locale === 'en'
					? monthMap[Math.max(Math.min(11, month), 0)] || 'Month'
					: PmonthMap[month],
			between:
				locale === 'en'
					? georgianMonthToPersian[month]
					: persianMonthToGeorgian[month],
		};
	};

	// const getDateStringFromTimestamp = (timestamp: number) => {
	// 	let dateObject = new Date(timestamp);
	// 	let month = dateObject.getMonth() + 1;
	// 	let date = dateObject.getDate();
	// 	return (
	// 		dateObject.getFullYear() +
	// 		'-' +
	// 		(month < 10 ? '0' + month : month) +
	// 		'-' +
	// 		(date < 10 ? '0' + date : date)
	// 	);
	// };

	// const setDate = (dateData) => {

	// 	let selectedDay = new Date(
	// 		dateData.year,
	// 		dateData.month - 1,
	// 		dateData.date
	// 	).getTime();
	// 	if (type === 'range') {
	// 		setRange(selectedDay);
	// 	} else {
	// 		setState((prev) => {
	// 			return { ...prev, selectedDay };
	// 		});
	// 		if (onChange) {
	// 			onChange(selectedDay);
	// 		}
	// 	}
	// };

	const setRange = (selectedDay: number): void => {
		if (
			state.from &&
			state.to &&
			state.from === state.to &&
			state.from === selectedDay
		) {
			setState((prev) => {
				return {
					...prev,
					from: null,
					to: null,
					hoveredDay: null,
				};
			});
			return;
		}
		if (!state.from) {
			setState((prev) => {
				return {
					...prev,
					from: selectedDay,
					hoveredDay: selectedDay,
				};
			});
		} else {
			if (selectedDay > state.from) {
				if (
					state.to &&
					Math.abs(selectedDay - state.from) < Math.abs(state.to - selectedDay)
				) {
					setState((prev) => {
						return {
							...prev,
							selectedDay,
							from: selectedDay,
							hoveredDay: selectedDay,
						};
					});
				} else if (state.to === selectedDay) {
					setState((prev) => {
						return {
							...prev,
							selectedDay,
							from: selectedDay,
							to: selectedDay,
							hoveredDay: selectedDay,
						};
					});
				} else {
					setState((prev) => {
						return {
							...prev,
							to: selectedDay,
							hoveredDay: selectedDay,
						};
					});
				}
			} else if (state.from > selectedDay) {
				setState((prev) => {
					return {
						...prev,
						selectedDay,
						from: selectedDay,
						hoveredDay: selectedDay,
					};
				});
			} else if (state.from === selectedDay) {
				setState((prev) => {
					return {
						...prev,
						selectedDay,
						from: selectedDay,
						to: selectedDay,
						hoveredDay: selectedDay,
					};
				});
			}
		}
	};
	// const updateDateFromInput = () => {
	// 	let dateValue = inputRef.current.value;
	// 	let dateData = getDateFromDateString(dateValue);
	// 	if (dateData !== null) {
	// 		setDate(dateData);
	// 		setState((prev) => {
	// 			return {
	// 				...prev,
	// 				year: dateData.year,
	// 				month: dateData.month - 1,
	// 			};
	// 		});
	// 	}
	// };

	// const setDateToInput = (timestamp) => {
	// 	let dateString = getDateStringFromTimestamp(timestamp);
	// 	inputRef.current.value = dateString;
	// };

	const onDateClick = (day: number): void => {
		if (type === 'range') {
			setRange(day);
		} else {
			setState((prev) => {
				// setDateToInput(day.timestamp);
				return { ...prev, selectedDay: day };
			});
			// if (onChange) {
			// 	onChange(day);
			// }
		}
	};

	const setYear = (offset: 1 | -1): void => {
		let year = state.year + offset;
		setState((prev) => {
			return {
				...prev,
				year,
			};
		});
	};

	const setMonth = (offset: 1 | -1): void => {
		let year = state.year;
		let month = state.month + offset;
		if (month === -1) {
			month = 11;
			year--;
		} else if (month === 12) {
			month = 0;
			year++;
		}
		setState((prev) => {
			return {
				...prev,
				year,
				month,
			};
		});
	};

	/**
	 *  Renderers
	 */

	const isInRange = (timestamp: number) => {
		if (!state.to) return false;
		return state.from && timestamp > state.from && timestamp < state.to;
	};
	const isFromDate = (timestamp: number): boolean => {
		return timestamp === state.from;
	};
	const isEndDate = (timestamp: number): boolean => {
		return timestamp === state.to;
	};

	const renderDay = (day: any, index: number): React.ReactNode => {
		return (
			<div
				onMouseOver={() => {
					if (!state.to && state.hoveredDay) {
						setState((prev) => {
							return {
								...prev,
								hoveredDay: day.timestamp,
							};
						});
					} else if (state.to && state.hoveredDay) {
						setState((prev) => {
							return {
								...prev,
								hoveredDay: day.timestamp,
							};
						});
					}
				}}
				className={`c-day-container ${day.month !== 0 ? 'disabled' : ''} ${
					state.from &&
					!state.to &&
					// @ts-ignore
					state.hoveredDay >= day.timestamp &&
					day.timestamp > state.from
						? ' highlight-inRange-hover'
						: ''
				} ${
					!state.from &&
					state.to &&
					// @ts-ignore
					state.hoveredDay <= day.timestamp &&
					day.timestamp < state.to
						? ' highlight-inRange-hover'
						: ''
				} ${isCurrentDay(day.timestamp) ? 'highlight' : ''} ${
					type !== 'range' && isSelectedDay(day.timestamp)
						? ' highlight-selected'
						: ''
				} ${
					isFromDate(day.timestamp)
						? locale === 'en'
							? ' highlight-toDate'
							: ' highlight-toDate-rtl'
						: ''
				} ${isInRange(day.timestamp) ? ' highlight-inRange' : ''} ${
					isEndDate(day.timestamp)
						? locale === 'en'
							? ' highlight-endDate'
							: ' highlight-endDate-rtl'
						: ''
				}`}
				style={day.month !== 0 ? { opacity: 0 } : {}}
				key={index}
				onClick={() => onDateClick(day.timestamp)}
			>
				<div className="cdc-day">
					{locale === 'en' ? (
						<>
							<span className="cdc-day-bold">{day.date.date()}</span>
							<span>{day.date.jDate().toLocaleString('fa')}</span>
						</>
					) : (
						<>
							<span className="cdc-day-bold" style={{ fontSize: '16px' }}>
								{day.date.jDate().toLocaleString('fa')}
							</span>
							<span style={{ fontSize: '10px' }}>{day.date.date()}</span>
						</>
					)}
				</div>
			</div>
		);
	};

	const renderEvents = (month: any) => {
		const thisMonthEvents: event[] = events.reduce(
			(acc: event[], el: event) => {
				if (new Date(el.date).getMonth() + 1 === month) {
					acc.push(el);
					return acc;
				}
				return acc;
			},
			[]
		);

		return thisMonthEvents.length > 0
			? thisMonthEvents.map((event: event) => <li>{event.event}</li>)
			: '';
	};

	const renderCalendar = (year: number, month: number) => {
		const monthD = getMonthDetails(year, month);

		let days = monthD.map((day, index) => renderDay(day, index));
		const weekNameList =
			locale === 'en'
				? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
				: ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'];
		return (
			<div
				className="c-container"
				style={{ direction: locale === 'fa' ? 'rtl' : 'ltr' }}
			>
				<div className="cc-head">
					{weekNameList.map((dName, i) => (
						<div key={i} className="cch-name">
							{dName}
						</div>
					))}
				</div>
				<div className="cc-body">{days}</div>
				<div className="cc-body-events">{renderEvents(month)}</div>
			</div>
		);
	};

	return (
		<>
			{showDatePicker ? (
				<Calendar
					setMonth={setMonth}
					// setYear={setYear}
					year={state.year}
					month={state.month}
					renderCalendar={renderCalendar}
					getMonthStr={getMonthStr}
					onLocaleChange={onLocaleChange}
					locale={locale}
					doubleMonth={doubleMonth}
				/>
			) : (
				''
			)}
		</>
	);
};
export default MyDatePicker;
