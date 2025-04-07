import { EventData } from "../types";

export const eventsData: Record<number, EventData> = {
    0: {
        id: 0,
        dialogue: [
            {
                text: {
                    en: 'Hurry! We need to get this done before anyone catches us.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '0',
                typeRight: '1'
            },
            {
                text: {
                    en: 'C’mon! It’s too late to panic now. They say there are tons of rubies down there.',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            },
            {
                text: {
                    en: 'And that’s exactly why the elders banned digging here—or so the dwarves say.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '1',
                typeRight: '1'
            },
            {
                text: {
                    en: 'You want those rubies or not? Stop talkin’ and start diggin’!',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            }
        ],
        
    },
    1: {
        id: 1,
        dialogue: [
            {
                text: {
                    en: 'This ore\'s tough — never seen anything like it.',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '1'
            },
            {
                text: {
                    en: 'We’ve dealt with tougher. I’ve still got the tools from that last mithril run — they should handle this.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '0',
                typeRight: '0'
            },
            {
                text: {
                    en: 'Looks like it’s working. There have to be more rubies down here!',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '1',
                typeRight: '1'
            },
            {
                text: {
                    en: 'Just go easy. We’ll need those tools again.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '0',
                typeRight: '0'
            }
        ],
        
    },
    2: {
        id: 2,
        dialogue: [
            {
                text: {
                    en: 'WAAAIT! The hard ore’s gone — there’s something weird up ahead.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '0',
                typeRight: '1'
            },
            {
                text: {
                    en: 'I don’t like it… it feels alive. Let’s grab what we’ve mined and get out.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '1',
                typeRight: '1'
            },
            {
                text: {
                    en: 'Even better! This next layer is soft and easy to dig. It’s got a reddish tint too — bet it means more rubies!',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            },
            {
                text: {
                    en: 'The rubies we’ve got will last us a long time. If no one finds out about this place, we can come back.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '1',
                typeRight: '1'
            },
            {
                text: {
                    en: 'The elders will find out — and they’ll lock this place down for good. We take everything. Now.',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            }
        ],
        
    },
    3: {
        id: 3,
        dialogue: [
            {
                text: {
                    en: 'It’s HUGE!',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            },
            {
                text: {
                    en: ' I don’t like this… Why is it getting colder? The ore feels like it’s dying.',
                    ru: '',
                    hint: ''
                },
                character: 'left',
                typeLeft: '1',
                typeRight: '1'
            },
            {
                text: {
                    en: 'Who cares? It’s just worthless dirt now. Let’s grab that giant ruby and get out of here!',
                    ru: '',
                    hint: ''
                },
                character: 'right',
                typeLeft: '0',
                typeRight: '0'
            }
        ],
        
    }
}