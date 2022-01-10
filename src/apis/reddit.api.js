import { REDDIT_BASE_URL } from '../util/constants';

export const fetchAll = () => {
  return fetch(`${REDDIT_BASE_URL}r/all.json`);
};

export const fetchOne = (permalink) => {
  return fetch(`${REDDIT_BASE_URL}${permalink}.json`);
};
