import React from 'react';
import CalendarHeader from '../CalendarHeader';

interface CalendarProps {
	setMonth: (offset: 1 | -1) => void;
	year: number;
	month: number;
	getMonthStr: (month: number) => {
		monthName: string;
		between: string;
	};
	renderCalendar: (year: number, month: number) => React.ReactNode;
	locale: 'fa' | 'en';
	onLocaleChange: () => void;
	doubleMonth: boolean;
}

const Calender: React.FC<CalendarProps> = ({
	setMonth,
	year,
	month,
	getMonthStr,
	renderCalendar,
	locale,
	onLocaleChange,
	doubleMonth,
}) => {
	return (
		<div className="mdp-container">
			<CalendarHeader
				year={year}
				month={month}
				setMonth={setMonth}
				getMonthStr={getMonthStr}
				doubleMonth={doubleMonth}
			/>
			<div style={{ display: 'flex', width: '100%' }}>
				<div
					className="mdpc-body"
					style={!doubleMonth ? { marginRight: 0 } : {}}
				>
					{renderCalendar(year, month)}
				</div>
				{doubleMonth && (
					<div className="mdpc-body">
						{renderCalendar(
							month === 11 ? year + 1 : year,
							month === 11 ? 0 : month + 1
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Calender;
