//JOB CLASS SPRITES GENERATOR
const data_body = {
    fSpecial1: {
        reversed: {
            acts: ["pick", "damaged", "dead", "cast"],
            dirs: ["f", "f", "f", "f"],
        },
    },
    fNovice: {
        reversed: {
            acts: ["pick"],
            dirs: ["f"],
        },
    },
    fMonk: {
        reversed: {
            acts: ["pick"],
            dirs: ["f"],
        },
    },
    fNinja: {
        reversed: null,
    },
    fAlchemist: {
        reversed: {
            acts: ["attack1", "attack3"],
            dirs: ["b", "b"],
        },
    },
    fOboro: {
        reversed: null,
    },
    fRebellion: { reversed: null },
    fRoyalGuard: { reversed: null },
    fGunslinger: { reversed: null },
    fSwordsman: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fCrusader: {
        reversed: {
            acts: ["attack2", "cast"],
            dirs: ["both", "both"],
        },
    },
    fTaekwonKid: { reversed: null },
    fArcher: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fThief: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fRanger: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fLordKnight: {
        reversed: { acts: ["attack1", "attack3"], dirs: ["b", "b"] },
    },
    fMechanic: { reversed: null },
    fBlacksmith: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fTaekwonMaster: { reversed: null }, //<-----FIX THIS
    fAssassin: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fShadowChaser: { reversed: null },
    fArcBishop: { reversed: null },
    fAcolyte: { reversed: null },
    fPriest: { reversed: null },
    fSage: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fHunter: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fHighPriest: { reversed: null },
    fSura: { reversed: null },
    fDancer: { reversed: null },
    fGuillotineCross: { reversed: null },
    fBiochemist: {
        reversed: { acts: ["attack3", "attack1"], dirs: ["b", "b"] },
    },
    fWizard: { reversed: { acts: ["pick"], dirs: ["b"] } },
    fMage: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fWanderer: { reversed: null },
    fWarlock: { reversed: null },
    fKnight: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fMerchant: { reversed: { acts: ["pick"], dirs: ["b"] } },
    fRuneKnight: { reversed: null },
    fRogue: { reversed: null },
    fSoulLinker: { reversed: null },
    fSorcerer: { reversed: null },
    fSuperNovice: { reversed: { acts: ["pick"], dirs: ["f"] } },
    fSniper: { reversed: null },
    fStalker: { reversed: null },
    fAssassinCross: { reversed: null },
    fGeneticist: {
        reversed: { acts: ["attack3", "attack1"], dirs: ["b", "b"] },
    },
    fPaladin: {
        reversed: {
            acts: ["attack2", "cast"],
            dirs: ["both", "both"],
        },
    },
    fGypsy: { reversed: null },
    fScholar: { reversed: null },
    fHighWizard: { reversed: null },
    fMasterSmith: { reversed: null },
    fChampion: { reversed: null },
};
//sort the class props
const sortedClass = Object.keys(data_body).sort();

exports.sortedClass = sortedClass;
exports.data_body = data_body;
