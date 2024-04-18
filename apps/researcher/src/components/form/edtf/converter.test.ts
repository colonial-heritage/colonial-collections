import {expect} from '@jest/globals';
import {fromDateString, toDateString} from './converter';

describe('toDateString', () => {
  it('returns an empty string when no date parts are provided', () => {
    const result = toDateString();
    expect(result).toEqual('');
  });

  it('returns the correct date string when all date parts are provided', () => {
    const yyyy = '2022';
    const mm = '10';
    const dd = '15';
    const result = toDateString(yyyy, mm, dd);
    expect(result).toEqual('2022-10-15');
  });

  it('returns the correct date string when only year and month are provided', () => {
    const yyyy = '2022';
    const mm = '10';
    const result = toDateString(yyyy, mm);
    expect(result).toEqual('2022-10');
  });

  it('returns the year when only year and day are provided', () => {
    const yyyy = '2022';
    const dd = '15';
    const result = toDateString(yyyy, undefined, dd);
    expect(result).toEqual('2022');
  });

  it('returns the correct date string when only year is provided', () => {
    const yyyy = '2022';
    const result = toDateString(yyyy);
    expect(result).toEqual('2022');
  });

  it('returns a negative year if year is negative', () => {
    const yyyy = '-500';
    const result = toDateString(yyyy);
    expect(result).toEqual('-0500');
  });

  it('returns the correct date string when year is negative and month and day are provided', () => {
    const yyyy = '-1000';
    const mm = '10';
    const dd = '15';
    const result = toDateString(yyyy, mm, dd);
    expect(result).toEqual('-1000-10-15');
  });
});

describe('fromDateString', () => {
  it('returns the correct date parts when a valid date string is provided', () => {
    const dateString = '2022-10-15';
    const result = fromDateString(dateString);
    expect(result).toEqual({yyyy: '2022', mm: '10', dd: '15'});
  });

  it('returns an empty string for year, month and day when an empty string is provided', () => {
    const dateString = '';
    const result = fromDateString(dateString);
    expect(result).toEqual({yyyy: '', mm: '', dd: ''});
  });

  it('returns the correct date parts when a negative year is provided', () => {
    const dateString = '-0500-10-15';
    const result = fromDateString(dateString);
    expect(result).toEqual({yyyy: '-500', mm: '10', dd: '15'});
  });

  it('returns the correct date parts when leading zeros are present', () => {
    const dateString = '0001-01-01';
    const result = fromDateString(dateString);
    expect(result).toEqual({yyyy: '1', mm: '1', dd: '1'});
  });

  it('returns the correct date parts when only a year is provided', () => {
    const dateString = '2022';
    const result = fromDateString(dateString);
    expect(result).toEqual({yyyy: '2022', mm: '', dd: ''});
  });
});
