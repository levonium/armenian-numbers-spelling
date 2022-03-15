<?php

class Speller
{
	public string $result;

	public float $number;

	protected string $zero = 'ԶՐՕ';

	protected array $single_digits = [
		1 => 'ՄԵԿ',
		2 => 'ԵՐԿՈՒ',
		3 => 'ԵՐԵՔ',
		4 => 'ՉՈՐՍ',
		5 => 'ՀԻՆԳ',
		6 => 'ՎԵՑ',
		7 => 'ՅՈԹ',
		8 => 'ՈՒԹ',
		9 => 'ԻՆԸ',
	];

	protected array $decimals = [
		1 => 'ՏԱՍԸ',
		2 => 'ՔՍԱՆ',
		3 => 'ԵՐԵՍՈՒՆ',
		4 => 'ՔԱՌԱՍՈՒՆ',
		5 => 'ՀԻՍՈՒՆ',
		6 => 'ՎԱԹՍՈՒՆ',
		7 => 'ՅՈԹԱՆԱՍՈՒՆ',
		8 => 'ՈՒԹՍՈՒՆ',
		9 => 'ԻՆԻՍՈՒՆ',
	];

	protected string $hundred = 'ՀԱՐՅՈՒՐ';

	protected array $thousands = [
		3 => 'ՀԱԶԱՐ',
		6 => 'ՄԻԼԻՈՆ',
		9 => 'ՄԻԼԻԱՐԴ',
		12 => 'ՏՐԻԼԻՈՆ',
		15 => 'ԿՎԱԴՐԻԼԻՕՆ',
		18 => 'ՔՎԻՆՏԻԼԻՕՆ',
		21 => 'ՍԵՔՍՏԻԼԻՕՆ',
		24 => 'ՍԵՊՏԻԼԻՕՆ',
		27 => 'ՕԿՏԻԼԻՕՆ',
		30 => 'ՆՕՆԻԼԻՕՆ',
	];

	public function __construct(float $number)
	{
		$this->number = $number;

		$this->result = $this->handle();
	}

	public function handle(): string
	{
		if ($this->number === 0) {
			return $this->zero;
		}

		if (strlen(strval($this->number)) > 31) {
			return 'Too large number.';
		}

		$result = [];

		foreach ($this->groups() as $key => $number) {

			$thousand = $key !== 0 ? ' ' . $this->thousands[$key * 3] : '';

			$prefix = $this->convert(intval($number));

			$result[] = (($prefix === 'ՄԵԿ' && $key === 1) ? '' : $prefix) . $thousand;
		}

		return trim(implode(' ', $result));
	}

	/**
	 * Divides/groups a number's string value into an array of triple-digit number strings.
	 * For example, "12_345_678" would become ["012", "345", "678"]
	 */
	public function groups(): array
	{
		$str = strval($this->number);

		$length = strlen($str);

		$number_of_groups = ceil($length / 3);

		$groups = [];

		$i = 1;
		while ($i <= $number_of_groups) {

			// offset is 3, unless it's the first (from left) group, in which case it's 0
			$str_offset = $length - 3 * $i < 0 ? 0 : $length - 3 * $i;

			// group length is 3, unless it's the first (from left) group and there are < 3 digits
			$str_length = $length - 3 * $i < 0 ? $length - 3 * ($i - 1) : 3;

			// get the "group" of numbers
			$group = substr($str, $str_offset, $str_length);

			// if there are less than 3 digits in a group, add 0s in front of them
			$group = str_pad($group, 3, '0', STR_PAD_LEFT);

			$groups[] = $group;

			$i++;
		}

		return array_reverse($groups, true);
	}

	/**
	 * Converts a triple-digit number into it's Armenian string version.
	 */
	public function convert(int $number): string
	{
		$armenian = '';

		$hundreds = intval(floor($number / 100));
		if ($hundreds !== 0) {

			if ($hundreds !== 1) {
				$armenian .= $this->single_digits[$hundreds] . ' ';
			}

			$armenian .= $this->hundred;
		}

		$decimals = intval(floor(($number - $hundreds * 100) / 10));
		if ($decimals !== 0) {

			$armenian .= ' ' . $this->decimals[$decimals];
		}

		$s = $number - $hundreds * 100 - $decimals * 10;
		if ($s !== 0) {

			$armenian .= $this->single_digits[$s] ?? '';

			$armenian = str_replace('ՏԱՍԸ', 'ՏԱՍՆ', $armenian);
		}

		return $armenian;
	}
}

$r = new Speller(12_100_611);

var_dump($r->number, $r->result);
