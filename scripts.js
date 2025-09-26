function convertClickableText() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.includes('{{') || node.nodeValue.includes('[')) {
            textNodes.push(node);
        }
    }

    textNodes.forEach(textNode => {
        let text = textNode.nodeValue;
        
        const symbolRegex = /\{\{([^|]+)\|([^|]+)\|(paper|code|presentation|poster|link|external|github|email|document)symbol\}\}/g;
        text = text.replace(symbolRegex, (match, linkText, url, symbolType) => {
            const iconMap = {
                'paper': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'code': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="16,18 22,12 16,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="8,6 2,12 8,18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'presentation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'poster': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="none" stroke="currentColor" stroke-width="2"/>
                    <polyline points="21,15 16,10 5,21" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>`,
                'link': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'external': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'github': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="currentColor"/>
                </svg>`,
                'email': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'document': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
            };
            
            return `<a href="${url.trim()}" class="symbol-link" target="_blank" title="${linkText.trim()}">${iconMap[symbolType] || '📄'}</a>`;
        });
        const clickableRegex = /\{\{([^|]+)\|([^|]+)\|(green|orange)\}\}/g;
        text = text.replace(clickableRegex, (match, linkText, url, color) => {
            const cleanLinkText = linkText.trim();
            const cleanUrl = url.trim();
            const cleanColor = color.trim();
            
            if (cleanUrl.startsWith('#')) {
                return `<a href="${cleanUrl}" class="clicky clicky--${cleanColor} internal-link">${cleanLinkText}</a>`;
            } else {
                return `<a href="${cleanUrl}" class="clicky clicky--${cleanColor}" target="_blank">${cleanLinkText}</a>`;
            }
        });
        
        const researchRegex = /\[([^\]]+)\]/g;
        text = text.replace(researchRegex, (match, type) => {
            const iconMap = {
                'paper': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'code': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="16,18 22,12 16,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="8,6 2,12 8,18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                'presentation': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
            };
            
            const urlMap = {
                'paper': 'assets/weak-metric-paper.pdf',
                'code': 'https://github.com/brianxchen/weak-metric',
                'presentation': 'assets/weak-metric-presentation.pdf'
            };
            
            return `<a href="${urlMap[type] || '#'}" class="symbol-link" target="_blank" title="${type.charAt(0).toUpperCase() + type.slice(1)}">${iconMap[type] || type}</a>`;
        });
        
        if (text !== textNode.nodeValue) {
            const parent = textNode.parentNode;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            
            while (tempDiv.firstChild) {
                parent.insertBefore(tempDiv.firstChild, textNode);
            }
            parent.removeChild(textNode);
        }
    });
}

function handleInternalLinks() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a.internal-link, a.internal-link *')) {
            e.preventDefault();
            const link = e.target.closest('a.internal-link');
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}
const cabinetData = [
    {
        type: 'quote',
        content: 'On clear days, I can see that I’m a small and simple part of a big and complex ancient structure. In some mysterious way we are connected to each other. And we grow from that connection',
        author: 'June Huh'
    },
    {
        type: 'quote',
        content: 'Life is such a beautiful gift. Whatever happens, happens, and then we are gone.',
        author: 'Guillermo Del Toro'
    },
    {
        type: 'quote',
        content: 'In a letter to a friend, Dvorak recounted how deeply the music of Brahm’s new work had moved him. “What magnificent melodies there are for the finding! It is full of love, and makes one’s heart melt.” We would do well to seek out that mood, those melodies, that melting, unspoken love in this passionate symphonic utterance.',
        author: 'Marilyn L. McCoy'
    },
    {
        type: 'poem',
        title: 'For Grace, After A Party',
        content: `You do not always know what I am feeling.
Last night in the warm spring air while I was
blazing my tirade against someone who doesn't interest
        me, it was love for you that set me
afire,

     and isn't it odd? for in rooms full of
strangers my most tender feelings
                                  writhe and
bear the fruit of screaming. Put out your hand, isn't there
             an ashtray, suddenly, there? beside
the bed?  And someone you love enters the room and says wouldn't
                  you like the eggs a little

different today?
                And when they arrive they are
just plain scrambled eggs and the warm weather is holding.`,
        author: 'Frank O\'Hara'
    },
    {
        type: 'poem',
        title: 'Statement of Teaching Philosophy',
        content: `My students want certainty. They want it
so badly. They respect science and have memorized
complex formulas. I don\’t know
how to tell my students their parents
are still just as scared. The bullies get bigger
and vaguer and you cannot punch a cloud.
I have eulogies for all my loved ones prepared,
but cannot include this fact in my lesson plans.
The best teacher I ever had told me to meet him
at the basketball court. We played pick-up for hours.
By the end, I lay panting on the hardwood
and couldn\’t so much as stand.
He told me to describe the pain in my chest.
I tried. I couldn\’t find the words. Not exactly.
Listen, he said, that\’s where language ends.`,
        author: 'Keith Leonard'
    },
    {
        type: 'quote',
        content: 'There is no abstract art. one must always begin with something. then one may remove all appearance of reality; there is no longer a risk, as the idea of the object has left an indelible mark.',
        author: 'Pablo Picasso'
    },
    {
        type: 'quote',
        content: 'In conclusion, drink tea, together with your friends; pay attention to the tea, and to your friends, and pay attention to your friends paying attention to the tea. Therein lies the meaning of life.',
        author: 'Sarah Perry'
    },
    {
        type: 'quote',
        content: 'Twenty years ago, I used to find the anthropic interpretation of the universe upsetting, in part because of the difficulty it might present in understanding physics. Over the years I have mellowed. I suppose I reluctantly came to accept that the universe was not created for our convenience in understanding it.',
        author: 'Edward Witten'
    },
    {
        type: 'quote',
        content: 'You know how everyone\'s always saying seize the moment? I don\'t know, I\'m kinda thinking it\'s the other way around. You know, like the moment seizes us.',
        author: 'Nicole (Boyhood)'
    },
    {
        type: 'quote',
        content: 'I only drink champagne on two occasions: when I am in love and when I am not.',
        author: 'Coco Chanel'
    },
    {
        type: 'poem',
        title: 'Elegy',
        content: `My shoes were growing more powerful
with each day. I walked in the country of letters,

its fields of eyes belonging to my lost sister—
dark eyes that early closed, or forgot

to open. I have not been back in some time,
though often I walk to my office, daydreaming

of that country’s fashions, the clothes of its citizens
like the clothes of my dearest dead or unborn.

In the heaven of letters, I will not walk.
I will not strip the golden clothes from my lover,

the wheat. I will stand, stay with the trees before me,
their ancient charisma that cares for me.

Like all scholars in any sort of heaven, I will study
the metaphysics of madness. I will find

that the littler the light, the better it tastes.
On Earth lately, I’ve been looking at everyone

like I love them, & maybe I do. Or maybe I only love
one person, & I’m beaming from it. Or actually

I just love myself, & I want people to know.
It seems the dead are busy with work we cannot

comprehend. & like parents, they don’t want to tell you
what their jobs really consist of, how much they make.

They don’t want to scare you, the dead. With what’s
left of their ankles, with their new secret wishes.`,
        author: 'Chen Chen'
    },
    {
        type: 'poem',
        title: '(excerpt from) October',
        content: `Sometimes in late summer I won’t touch anything, not
the flowers, not the blackberries
brimming in the thickets; I won’t drink
from the pond; I won’t name the birds or the trees;
I won’t whisper my own name.


One morning
the fox came down the hill, glittering and confident,
and didn’t see me—and I thought:


so this is the world.
I’m not in it.
It is beautiful.`,
        author: 'Mary Oliver'
    },
    {
        type: 'poem',
        title: 'In the Woods of Language, She Collects Beautiful Sticks',
        content: `like a snail with a shell of sticks

    — she loads them on her back —

Like a camel with a hump of sticks

    — on her back, on her back —

Like a horse with a knight of sticks and a stick for a sword

Where is she taking this load of sticks?

    — on her hump, on her hump —

She has no house, where is she taking the house she doesn’t have?

    — in the fire she is taking it in the fire —

In the fire she is making a poem entirely out of sticks on fire and it goes like this

/////////////////////////////////////////////////////////`,
        author: 'Valzhyna Mort'
    },
    {
        type: 'poem',
        title: '(excerpt from) Habitable Nebula',
        content: `I still can’t say what life is for, but it can’t be to pretend
     that every part of it is knowable, or that what appears to be
to the naked eye or in the middle ground or documented on paper
     approximates a person any better than a daisy does our sun.

When at a loss for what I am, I know I must be feeling it
     deep in the layers, where a turbulence gives rise to clouds
so massive they collapse in a bliss of gravity, condensing into this
      music I can daisy into morning as it daisies me into morning.`,
        author: 'Timothy Donnelly'
    },
    {
        type: 'quote',
        content: '(Section 1.1 "Why Learn This Stuff" in R. Nystrom\'s book Crafting Interpreters)\n\nEvery introduction to compiler book seems to have this section. I don\'t know what it is about programming languages that causes such existential doubt. I don\'t think ornithology books worry about justifying their existence. They assume the reader loves birds and start teaching.',
        author: 'Robert Nystrom'
    },
    {
        type: 'poem',
        content: `I'm just gonna put it out there so that it can manifest: I love you G.

            Our lives have taken us in different directions, but not a single day goes by without me thinking about you--if you're doing okay, if you're happy, well fed.
            Every moment we spent together I replay them like a movie because the moment I saw you for the first time, I felt like I've known you forever. It was strange. It felt like coming home, like you were home.

            I still remember that night, when we were both kind of tipsy, it was pouring rain and you offered to help me carry a desk back to my place from halfway across town. We were laughing so hard at the absurdity of the situation--but did you know that I was falling utterly, deeply in love with you? That subway ride we took together looking like wet puppies, giggling at the strange faces in the car, making fun of the prospect of exchanging roses for books; we probably smelled like wine and naïveté.

            I love you and I'm still there, in the same train where we were. I hope you're doing okay and happy wherever you are. I picture your smile way too many times.

            Come back to me.
            Come back to me.
            Come back to me.
            Н.`,
        author: 'Anonymous (Columbia Confessions #13840)'
    }
];

function initializeCabinet() {
    const button = document.getElementById('lucky-button');
    const contentDiv = document.getElementById('cabinet-content');

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    shuffleArray(cabinetData);
    let idx = 0;
    let cabinetDataLength = cabinetData.length;
    if (button && contentDiv) {
        button.addEventListener('click', function() {
            const randomItem = cabinetData[idx];
            idx = (idx + 1) % cabinetDataLength;
            let html = '';
            if (randomItem.type === 'quote') {
                html = `
                    <blockquote>${randomItem.content}</blockquote>
                    <div class="attribution">— ${randomItem.author}</div>
                `;
            } else if (randomItem.type === 'poem') {
                html = `
                    ${randomItem.title ? `<div class="poem-title">${randomItem.title}</div>` : ''}
                    <div class="poem">${randomItem.content}</div>
                    <div class="attribution">— ${randomItem.author}</div>
                `;
            }
            
            contentDiv.innerHTML = html;
            contentDiv.classList.remove('hidden');
            
            button.textContent = 'another!';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    convertClickableText();
    handleInternalLinks();
    initializeCabinet();
});
