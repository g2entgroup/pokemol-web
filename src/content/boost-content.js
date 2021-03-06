export const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    price: '0',
    modalName: 'customThemeLaunch',
    successRoute: 'theme',
  },
  {
    name: 'Minion',
    key: 'vanillaMinion',
    description: 'Create and vote on execution of external contracts',
    price: '0',
    modalName: 'vanillaMinionLaunch',
    successRoute: '',
  },
  {
    name: 'Discord Notificatons',
    key: 'notificationsLevel1',
    description:
      'Customize and send notifications of DAO activity to your discord server',
    price: '0',
    modalName: 'notificationsLevel1Launch',
    successRoute: 'notifications',
  },
  {
    name: 'Discourse Forum',
    key: 'discourse',
    comingSoon: false,
    description:
      'Launch a new category for your DAO in the DAOhaus Discourse forum and enable topic creation for discussing all of your proposals.',
    price: '0',
    modalName: 'discourseLaunch',
    successRoute: '',
  },
  {
    name: 'Proposal Types',
    key: 'proposalTypes',
    description:
      'Customize the proposal types available for members to streamline onboarding or other DAO activities.',
    price: '0',
    modalName: 'ProposalTypesLaunch',
    successRoute: 'proposals',
  },
  {
    name: 'Minion Safe',
    key: 'minionSafe',
    description: 'Launch and interact with a Gnosis Safe multisig',
    price: '0',
    comingSoon: true,
    modalName: 'minionSafeLaunch',
    successRoute: '',
  },
  {
    name: 'Token Supply',
    key: 'tokenSupply',
    comingSoon: true,
    description:
      'Bring Your Own Token or a Launch a new one and manage issuance as a DAO.',
    price: '1',
    modalName: 'tokenSupply',
    successRoute: '',
  },
  {
    name: 'Offchain Voting',
    key: 'offchainVoting',
    comingSoon: true,
    description:
      'Gasless voting for quicker, smaller decisions or just collecting signal.',
    price: '1',
    modalName: 'offchainVoting',
    successRoute: '',
  },
  {
    name: 'Manage Liquidity',
    key: 'liquidity',
    comingSoon: true,
    description: 'Set pool parameters and add or remove liquidity collectively',
    price: '1',
    modalName: 'manageLiquidity',
    successRoute: '',
  },
  {
    name: 'NFT Banks',
    key: 'nftBank',
    comingSoon: true,
    description: 'Buy, sell & showcase NFTs as a DAO',
    price: '1',
    modalName: 'nftBank',
    successRoute: '',
  },
];

export const notificationBoostContent = {
  actions: [
    {
      id: 'votingPeriod',
      label: 'Proposal Ready for Voting',
    },
    {
      id: 'newProposal',
      label: 'Proposal Needs Sponsor',
    },
    {
      id: 'proposalClosing',
      label: 'Proposal Needs a Vote',
      comingSoon: true,
    },
    {
      id: 'newMember',
      label: 'New Member is Official',
      comingSoon: true,
    },
    {
      id: 'rageQuit',
      label: 'New Ragequit',
    },
  ],
  channels: [
    { name: 'discord' },
    { name: 'telegram', comingSoon: true },
    { name: 'email', comingSoon: true },
    { name: 'twitter', comingSoon: true },
  ],
  inviteLinks: {
    discord:
      'https://discord.com/api/oauth2/authorize?client_id=736999684471521321&permissions=23552&scope=bot',
  },
};

export const proposalTypesContent = [
  { key: 'member', label: 'Member' },
  { key: 'funding', label: 'Funding' },
  { key: 'whitelist', label: 'Whitelist' },
  { key: 'trade', label: 'Trade' },
  { key: 'guildKick', label: 'Guild Kick' },
  {
    key: 'lootGrab',
    label: 'Loot Grab',
    options: [
      { id: 'ratio', type: 'text', default: 1, validation: 'greater than 0' },
    ],
  },
];
