export const DASHBOARD_COLORS = {
  brand: { green2: '#005943' },
  accent: {
    yellow: '#F5D547',
    green: '#63D556',
  },
  secondary: {
    yellow1: '#EBD343',
    yellow2: '#FAF4D0',
    yellow3: '#9E892E',
    green1: '#9ACC63',
    green2: '#E6F2D8',
    green4: '#087452',
    orange1: '#F09E5D',
    orange2: '#FBE7D7',
    cyan1: '#5FC8C9',
    cyan2: '#D7F1F2',
    cyan3: '#418382',
    violet1: '#AC8ED4',
    violet2: '#EBE4F5',
    rose1: '#EE8F9F',
    rose2: '#FCDADD',
    red1: '#F56C77',
    red2: '#FBE3E7',
    red4: '#B43E47',
    teal1: '#83ADB9',
    teal2: '#E1EBEE',
  },
  neutral: {
    whiteSolid: '#FFFFFF',
    grey1: '#12211C',
    grey2: '#53635C',
    grey3: '#6A7A72',
    grey4: '#BFCFC5',
    grey5: '#CBD1CD',
    grey6: '#DFE5E1',
    grey7: '#EDF3EF',
    grey8: '#F6F8F5',
  },
} as const;

export const PILL_TONE_STYLES = {
  active: { background: '#E6F2D8', color: '#087452' },
  neutral: { background: '#F6F8F5', color: '#6A7A72' },
  up: { background: '#E6F2D8', color: '#087452' },
  down: { background: '#FBE3E7', color: '#B43E47' },
} as const;

export const ZONE_COLORS = {
  Thrive: { label: 'Thrive Zone', range: '(80-100%)', color: '#005943', bg: '#E6F2D8' },
  Momentum: { label: 'Momentum Zone', range: '(70-79%)', color: '#087452', bg: '#E6F2D8' },
  Function: { label: 'Function Zone', range: '(50-69%)', color: '#53635C', bg: '#FAF4D0' },
  Survive: { label: 'Survive Zone', range: '(0-49%)', color: '#B43E47', bg: '#FBE3E7' },
} as const;
