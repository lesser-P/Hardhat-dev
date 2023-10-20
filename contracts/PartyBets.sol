pragma solidity ^0.8.0;

contract PartyBets {
    struct BetRecord {
        //下注信息
        address betAddress;
        string issueNo;
        uint256 timestamp;
        uint256 guessPrice;
        uint256 betPrice;
    }

    struct IssueRecordStatic {
        uint256 orderNum; //下单数
        uint256 pricePool; //资金池
        uint256 resultPrice; //结果价格
    }

    // address=>issueNo
    mapping(address => string[]) public personBetIssueRows;

    //keccak256(issueNo) => IssueRecordStatic  在这一轮赌盘的信息
    mapping(uint256 => IssueRecordStatic) public issueRecordStaticRow;

    //keccak256(issueNo)=>BetRecords
    mapping(uint256 => BetRecord[]) public issueResultRows;

    //keecak256(issueNo)=>BetRecords
    mapping(uint256 => BetRecord[]) public issueBetRecordRows;

    mapping(uint256 => mapping(address => uint256)) public claimedRewards;

    uint256 public betPrice = 0.001 ether;
    bool public available = true;
    uint256 public betFee = 10;
    mapping(address => bool) private superOperators;

    modifier onlyAdmin() {
        require(superOperators[msg.sender], "Not super operator");
        _;
    }
    event ClaimSuccess(address operator, uint256 amount, string issueNo);
    event GuessSuccess(
        address operator,
        uint256 guessPrice,
        uint256 betPrice,
        string issueNo,
        uint256 pricePool,
        int256 referId
    );
    event IssueResultSuccess(
        address operator,
        uint256 requestPrice,
        string issueNo
    );
    event AuthorizedOperator(address indexed operator, address indexed holder);
    event RevokedOperator(address indexed operator, address indexed holder);

    constructor() {
        superOperators[msg.sender] = true;
    }

    function guess(uint256 guessPrice, int256 referId) public payable {
        require(available, "Have Been Closed");
        require(isTimeToDo(), "Closed. Wait for the next round!");
        require(guessPrice > 0, "Guess price must be greater than 0!");
        require(msg.value >= betPrice, "Not enough ETH sent for this request");

        string memory issueNo = getIssuNo();
        uint256 issueNoKey = makeUintKey(issueNo);
        require(
            issueResultRows[issueNoKey].length < 1,
            "This round have been closed! Wait for the next round!"
        );

        //记录本轮信息
        BetRecord memory betRecord;
        betRecord.issueNo = issueNo;
        betRecord.betAddress = msg.sender;
        betRecord.timestamp = block.timestamp;
        betRecord.betPrice = msg.value;
        betRecord.guessPrice = guessPrice;

        //加入记录
        issueBetRecordRows[issueNoKey].push(betRecord);
        personBetIssueRows[msg.sender].push(betRecord.issueNo);

        IssueRecordStatic memory issueRecordStatic = issueRecordStaticRow[
            issueNoKey
        ];

        issueRecordStatic.orderNum = issueRecordStatic.orderNum + 1;
        issueRecordStatic.pricePool =
            issueRecordStatic.pricePool +
            betRecord.betPrice;

        issueRecordStatic.resultPrice = 0;
        issueRecordStaticRow[issueNoKey] = issueRecordStatic;

        emit GuessSuccess(
            msg.sender,
            guessPrice,
            betPrice,
            betRecord.issueNo,
            issueRecordStatic.pricePool,
            referId
        );
    }

    function issueResult(
        uint256 resultPrice,
        string memory issueNo
    ) public onlyAdmin {
        uint256 issueNoKey = makeUintKey(issueNo);
        require(resultPrice > 0, "Price must be greater than 0");
        require(
            issueResultRows[issueNoKey].length < 1,
            "This round have been opened"
        );
        require(
            issueRecordStaticRow[issueNoKey].orderNum > 0,
            "There is incorrect issue number"
        );
        issueRecordStaticRow[issueNoKey].resultPrice = resultPrice;

        uint winnerPrice = 0;
        uint winnerMarginPrice;
        uint betRecordMarginPrice;

        for (uint i = 0; i < issueBetRecordRows[issueNoKey].length; i++) {
            if (i == 0) {
                winnerPrice = issueBetRecordRows[issueNoKey][i].guessPrice;
                continue;
            }
            winnerMarginPrice = absSub(winnerPrice, resultPrice);
            betRecordMarginPrice = absSub(
                issueBetRecordRows[issueNoKey][i].guessPrice,
                resultPrice
            );
            if (winnerMarginPrice > betRecordMarginPrice) {
                winnerPrice = issueBetRecordRows[issueNoKey][i].guessPrice;
            }
        }

        for (uint i = 0; i < issueBetRecordRows[issueNoKey].length; i++) {
            if (issueBetRecordRows[issueNoKey][i].guessPrice == winnerPrice) {
                issueResultRows[issueNoKey].push(
                    issueBetRecordRows[issueNoKey][i]
                );
            }
        }

        emit IssueResultSuccess(msg.sender, resultPrice, issueNo);
    }

    function getWinnerPercent(
        string memory issueNo,
        address winnerAddress
    ) public view returns (uint) {
        uint256 issueNoKey = makeUintKey(issueNo);
        uint total = issueResultRows[issueNoKey].length;
        require(total > 0, "This issue number is incorrect");

        uint winnerCounter = 0;
        for (uint i = 0; i < issueResultRows[issueNoKey].length; i++) {
            if (issueResultRows[issueNoKey][i].betAddress == winnerAddress) {
                winnerCounter++;
            }
        }

        return (winnerCounter / total);
    }

    function claim(string memory issueNo) public {
        uint256 issueNoKey = makeUintKey(issueNo);
        require(
            issueRecordStaticRow[issueNoKey].orderNum > 0,
            "This issue number is incorrect!"
        );
        address winnerAddress = msg.sender;
        require(
            claimedRewards[issueNoKey][winnerAddress] < 1,
            "you have claimed."
        );

        uint winnerPercent = getWinnerPercent(issueNo, winnerAddress);
        require(winnerPercent > 0, "There is no rewards for you ");
        uint256 totalRewards = (issueRecordStaticRow[issueNoKey].pricePool *
            (100 - betFee)) / 100;

        uint256 myRewards = totalRewards * winnerPercent;
        require(myRewards > 0, "You rewards is incorrect");
        uint256 balance = address(this).balance;

        require(balance > myRewards, "Balance is not enough");

        payable(winnerAddress).transfer(myRewards);
        claimedRewards[issueNoKey][winnerAddress] = myRewards;
        emit ClaimSuccess(winnerAddress, myRewards, issueNo);
    }

    function absSub(uint256 _a, uint256 _b) public pure returns (uint256) {
        if (_a > _b) {
            return _a - _b;
        } else {
            return _b - _a;
        }
    }

    function makeUintKey(string memory issueNo) public pure returns (uint256) {
        bytes32 issueNoKey = keccak256(bytes(issueNo));
        return uint256(issueNoKey);
    }

    function getIssuNo() public view returns (string memory) {
        uint256 timestamp = block.timestamp + 3600;
        uint year = BokkyPooBahsDateTimeLibrary.getYear(timestamp);
        uint month = BokkyPooBahsDateTimeLibrary.getMonth(timestamp);
        uint day = BokkyPooBahsDateTimeLibrary.getDay(timestamp);
        uint hour = BokkyPooBahsDateTimeLibrary.getHour(timestamp);

        string memory issueNo = string(
            abi.encodePacked(
                uintToString(year),
                "-",
                uintToString(month),
                "-",
                uintToString(day),
                "-",
                uintToString(hour)
            )
        );
        return issueNo;
    }

    function setBetFee(uint256 _betFee) public onlyAdmin {
        betFee = _betFee;
    }

    function setBetPrice(uint256 _betPrice) public onlyAdmin {
        betPrice = _betPrice;
    }

    function setBetAvailable(bool _available) public onlyAdmin {
        available = _available;
    }

    // allow receive ETH
    receive() external payable {}

    function isTimeToDo() internal view returns (bool) {
        uint256 timestamp = block.timestamp;
        uint minute = BokkyPooBahsDateTimeLibrary.getMinute(timestamp);
        if (minute > 55 || minute < 5) {
            return false;
        }
        return true;
    }

    function uintToString(uint256 num) internal pure returns (string memory) {
        if (num == 0) {
            return "0";
        }
        uint256 len;
        uint256 temp = num;
        while (temp != 0) {
            len++;
            temp /= 10;
        }
        bytes memory str = new bytes(len);
        temp = num;
        while (temp != 0) {
            len--;
            str[len] = bytes1(uint8(48 + (temp % 10)));
            temp /= 10;
        }
        return string(str);
    }

    function withdrawETH(address recipient, uint256 amount) public onlyAdmin {
        require(amount > 0, "amount is zero");
        require(recipient == address(0), "recipient is zero address");
        uint256 balance = address(this).balance;
        require(balance >= amount, "balance must be greater than amount");
        payable(recipient).transfer(amount);
    }

    function authorizeOperator(address _operator) external onlyAdmin {
        superOperators[_operator] = true;
        emit AuthorizedOperator(_operator, msg.sender);
    }

    function revokeOperator(address _operator) external onlyAdmin {
        superOperators[_operator] = false;
        emit RevokedOperator(_operator, msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserBetTotal(address _addr) public view returns (uint256) {
        return personBetIssueRows[_addr].length;
    }

    function getRoundResultTotal(
        string memory issueNo
    ) public view returns (uint256) {
        uint256 issueNoKey = makeUintKey(issueNo);
        return issueResultRows[issueNoKey].length;
    }

    function getRoundBetTotal(
        string memory issueNo
    ) public view returns (uint256) {
        uint256 issueNoKey = makeUintKey(issueNo);
        return issueBetRecordRows[issueNoKey].length;
    }

    function getRoundBetStatic(
        string memory issueNo
    ) public view returns (IssueRecordStatic memory) {
        uint256 issueNoKey = makeUintKey(issueNo);
        return issueRecordStaticRow[issueNoKey];
    }
}

library BokkyPooBahsDateTimeLibrary {
    //一天秒数
    uint constant SECONDS_PER_DAY = 24 * 60 * 60;
    //一小时秒数
    uint constant SECONDS_PER_HOUR = 60 * 60;
    //一分钟秒数
    uint constant SECONDS_PER_MINUTE = 60;
    int constant OFFSET19700101 = 2440588;

    //星期
    uint constant DOW_MON = 1;
    uint constant DOW_TUE = 2;
    uint constant DOW_WED = 3;
    uint constant DOW_THU = 4;
    uint constant DOW_FRI = 5;
    uint constant DOW_SAT = 6;
    uint constant DOW_SUN = 7;

    function _daysFromDate(
        uint year,
        uint month,
        uint day
    ) internal pure returns (uint _days) {
        require(year >= 1970);
        int _year = int(year);
        int _month = int(month);
        int _day = int(day);
        //转化为1970年1月1日以来的天数
        int __days = _day -
            32075 +
            (1461 * (_year + 4800 + (_month - 14) / 12)) /
            4 +
            (367 * (_month - 2 - ((_month - 14) / 12) * 12)) /
            12 -
            (3 * ((_year + 4900 + (_month - 14) / 12) / 100)) /
            4 -
            OFFSET19700101;

        _days = uint(__days);
    }

    function _daysToDate(
        uint _days
    ) internal pure returns (uint year, uint month, uint day) {
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int _month = (80 * L) / 2447;
        int _day = L - (2447 * _month) / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    function timestampFromDate(
        uint year,
        uint month,
        uint day
    ) internal pure returns (uint timestamp) {
        timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY;
    }

    function timestampFromDateTime(
        uint year,
        uint month,
        uint day,
        uint hour,
        uint minute,
        uint second
    ) internal pure returns (uint timestamp) {
        timestamp =
            _daysFromDate(year, month, day) *
            SECONDS_PER_DAY +
            hour *
            SECONDS_PER_HOUR +
            minute *
            SECONDS_PER_MINUTE +
            second;
    }

    function timestampToDate(
        uint timestamp
    ) internal pure returns (uint year, uint month, uint day) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    function timestampToDateTime(
        uint timestamp
    )
        internal
        pure
        returns (
            uint year,
            uint month,
            uint day,
            uint hour,
            uint minute,
            uint second
        )
    {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
        secs = secs % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
        second = secs % SECONDS_PER_MINUTE;
    }

    function isValidDate(
        uint year,
        uint month,
        uint day
    ) internal pure returns (bool valid) {
        if (year >= 1970 && month > 0 && month <= 12) {
            uint daysInMonth = _getDaysInMonth(year, month);
            if (day > 0 && day <= daysInMonth) {
                valid = true;
            }
        }
    }

    function isValidDateTime(
        uint year,
        uint month,
        uint day,
        uint hour,
        uint minute,
        uint second
    ) internal pure returns (bool valid) {
        if (isValidDate(year, month, day)) {
            if (hour < 24 && minute < 60 && second < 60) {
                valid = true;
            }
        }
    }

    function isLeapYear(uint timestamp) internal pure returns (bool leapYear) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        leapYear = _isLeapYear(year);
    }

    function _isLeapYear(uint year) internal pure returns (bool leapYear) {
        leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    function isWeekDay(uint timestamp) internal pure returns (bool weekDay) {
        weekDay = getDayOfWeek(timestamp) <= DOW_FRI;
    }

    function isWeekEnd(uint timestamp) internal pure returns (bool weekEnd) {
        weekEnd = getDayOfWeek(timestamp) >= DOW_SAT;
    }

    function getDaysInMonth(
        uint timestamp
    ) internal pure returns (uint daysInMonth) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        daysInMonth = _getDaysInMonth(year, month);
    }

    function _getDaysInMonth(
        uint year,
        uint month
    ) internal pure returns (uint daysInMonth) {
        if (
            month == 1 ||
            month == 3 ||
            month == 5 ||
            month == 7 ||
            month == 8 ||
            month == 10 ||
            month == 12
        ) {
            daysInMonth = 31;
        } else if (month != 2) {
            daysInMonth = 30;
        } else {
            daysInMonth = _isLeapYear(year) ? 29 : 28;
        }
    }

    // 1 = Monday, 7 = Sunday
    function getDayOfWeek(
        uint timestamp
    ) internal pure returns (uint dayOfWeek) {
        uint _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = ((_days + 3) % 7) + 1;
    }

    function getYear(uint timestamp) internal pure returns (uint year) {
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    function getMonth(uint timestamp) internal pure returns (uint month) {
        uint year;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    function getDay(uint timestamp) internal pure returns (uint day) {
        uint year;
        uint month;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    function getHour(uint timestamp) internal pure returns (uint hour) {
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
    }

    function getMinute(uint timestamp) internal pure returns (uint minute) {
        uint secs = timestamp % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
    }

    function getSecond(uint timestamp) internal pure returns (uint second) {
        second = timestamp % SECONDS_PER_MINUTE;
    }

    function addYears(
        uint timestamp,
        uint _years
    ) internal pure returns (uint newTimestamp) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        year += _years;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp =
            _daysFromDate(year, month, day) *
            SECONDS_PER_DAY +
            (timestamp % SECONDS_PER_DAY);
        require(newTimestamp >= timestamp);
    }

    function addMonths(
        uint timestamp,
        uint _months
    ) internal pure returns (uint newTimestamp) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        month += _months;
        year += (month - 1) / 12;
        month = ((month - 1) % 12) + 1;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp =
            _daysFromDate(year, month, day) *
            SECONDS_PER_DAY +
            (timestamp % SECONDS_PER_DAY);
        require(newTimestamp >= timestamp);
    }

    function addDays(
        uint timestamp,
        uint _days
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _days * SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }

    function addHours(
        uint timestamp,
        uint _hours
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _hours * SECONDS_PER_HOUR;
        require(newTimestamp >= timestamp);
    }

    function addMinutes(
        uint timestamp,
        uint _minutes
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp >= timestamp);
    }

    function addSeconds(
        uint timestamp,
        uint _seconds
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _seconds;
        require(newTimestamp >= timestamp);
    }

    function subYears(
        uint timestamp,
        uint _years
    ) internal pure returns (uint newTimestamp) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        year -= _years;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp =
            _daysFromDate(year, month, day) *
            SECONDS_PER_DAY +
            (timestamp % SECONDS_PER_DAY);
        require(newTimestamp <= timestamp);
    }

    function subMonths(
        uint timestamp,
        uint _months
    ) internal pure returns (uint newTimestamp) {
        uint year;
        uint month;
        uint day;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint yearMonth = year * 12 + (month - 1) - _months;
        year = yearMonth / 12;
        month = (yearMonth % 12) + 1;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp =
            _daysFromDate(year, month, day) *
            SECONDS_PER_DAY +
            (timestamp % SECONDS_PER_DAY);
        require(newTimestamp <= timestamp);
    }

    function subDays(
        uint timestamp,
        uint _days
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _days * SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }

    function subHours(
        uint timestamp,
        uint _hours
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _hours * SECONDS_PER_HOUR;
        require(newTimestamp <= timestamp);
    }

    function subMinutes(
        uint timestamp,
        uint _minutes
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp <= timestamp);
    }

    function subSeconds(
        uint timestamp,
        uint _seconds
    ) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _seconds;
        require(newTimestamp <= timestamp);
    }

    function diffYears(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _years) {
        require(fromTimestamp <= toTimestamp);
        uint fromYear;
        uint fromMonth;
        uint fromDay;
        uint toYear;
        uint toMonth;
        uint toDay;
        (fromYear, fromMonth, fromDay) = _daysToDate(
            fromTimestamp / SECONDS_PER_DAY
        );
        (toYear, toMonth, toDay) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
        _years = toYear - fromYear;
    }

    function diffMonths(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _months) {
        require(fromTimestamp <= toTimestamp);
        uint fromYear;
        uint fromMonth;
        uint fromDay;
        uint toYear;
        uint toMonth;
        uint toDay;
        (fromYear, fromMonth, fromDay) = _daysToDate(
            fromTimestamp / SECONDS_PER_DAY
        );
        (toYear, toMonth, toDay) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
        _months = toYear * 12 + toMonth - fromYear * 12 - fromMonth;
    }

    function diffDays(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _days) {
        require(fromTimestamp <= toTimestamp);
        _days = (toTimestamp - fromTimestamp) / SECONDS_PER_DAY;
    }

    function diffHours(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _hours) {
        require(fromTimestamp <= toTimestamp);
        _hours = (toTimestamp - fromTimestamp) / SECONDS_PER_HOUR;
    }

    function diffMinutes(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _minutes) {
        require(fromTimestamp <= toTimestamp);
        _minutes = (toTimestamp - fromTimestamp) / SECONDS_PER_MINUTE;
    }

    function diffSeconds(
        uint fromTimestamp,
        uint toTimestamp
    ) internal pure returns (uint _seconds) {
        require(fromTimestamp <= toTimestamp);
        _seconds = toTimestamp - fromTimestamp;
    }
}
