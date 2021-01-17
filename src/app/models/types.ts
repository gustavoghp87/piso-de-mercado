
export type typeUser = {
    username: string
    email: string
    password?: string
    superAdmin: boolean
    groupAdmin: boolean
    profileImage: string
    groups: typeGroup[]
    token: string
    showGroup?: string
    currentChannel?:string
}

export type typeGroup = {
    name: string
    channels: string[]
}

export type typeMessage = {
    username: string
    groupName: string
    channelName: string
    message: string
    profileImage: string
    isFile: boolean
    timestamp: number
    timeArg: string
}

export type typeProduct = {
    last_retrieved: string
    rtc: number
    rchp: number
    s: string
    last_update: string
    bid: number
    ask: number
    volume: number
    update_mode: string
    type: string
    short_name: string
    pro_name: string
    pricescale: number
    prev_close_price: number
    original_name: string
    open_price: number
    minmove2: number
    minmov: number
    lp: number
    low_price: number
    local_description: string
    language: string
    is_tradable: boolean
    high_price: number
    fractional: boolean
    exchange: string
    description: string
    current_session: string
    chp: number
    ch: number
    sector: string
    market_cap_basic: number
    industry: string
    earnings_per_share_basic_ttm: number
    dividends_yield: number
    beta_1_year: number
    basic_eps_net_income: number
    details?: boolean
}
