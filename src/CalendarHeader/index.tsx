import React from 'react';
import { ReactComponent as PreviousIcon } from './ic_back_arrow-left.svg';
import { ReactComponent as NextIcon } from './ic_back_arrow-right.svg';

interface CalendarHeaderProps {
	setMonth: (offset: 1 | -1) => void;
	getMonthStr: (month: number) => {
		monthName: string;
		between: string;
	};
	year: number;
	month: number;
	doubleMonth: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
	setMonth,
	getMonthStr,
	year,
	month,
	doubleMonth,
}) => {
	const currentMonth = getMonthStr(month);
	const nextMonth = getMonthStr(month === 11 ? 0 : month + 1);
	return (
		<div className="mdpc-head">
			<div
				className="mdpch-navigation-previous"
				style={!doubleMonth ? { width: '100%' } : {}}
			>
				<div className="mdpch-button" onClick={() => setMonth(-1)}>
					<PreviousIcon className="mdpch-button-previous" />
				</div>
				<div className="mdpch-container">
					<div className="mdpchc-date">
						<span className="mdpchc-year">{year}</span>
						<span className="mdpchc-monthName">{currentMonth.monthName}</span>
					</div>
					<div className="mdpchc-subDate">{getMonthStr(month).between}</div>
				</div>
				{!doubleMonth && (
					<div className="mdpch-button" onClick={() => setMonth(+1)}>
						<NextIcon className="mdpch-button-previous" />
					</div>
				)}
			</div>
			{doubleMonth && (
				<div className="mdpch-navigation-next">
					<div className="mdpch-container">
						<div className="mdpchc-date">
							<span className="mdpchc-year">
								{month === 11 ? year + 1 : year}
							</span>
							<span className="mdpchc-monthName">{nextMonth.monthName}</span>
						</div>
						<div className="mdpchc-subDate">{nextMonth.between}</div>
					</div>
					<div className="mdpch-button" onClick={() => setMonth(+1)}>
						<NextIcon className="mdpch-button-previous" />
					</div>
				</div>
			)}
		</div>
	);
};

export default CalendarHeader;
