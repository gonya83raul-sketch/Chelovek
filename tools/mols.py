#!/usr/bin/env python3
"""Библиотека малых молекул для сцен биохимии → data/mols.json"""
import base64, json, os, sys
from multiprocessing import Pool
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import molgen

RIBO_A = 'n1cnc2c(N)ncnc21'  # аденин через N9
LIB = {
    # витамины и коферменты
    'thiamine': ('Тиамин (B1)', 'Cc1ncc(C[n+]2csc(CCO)c2C)c(N)n1'),
    'tpp': ('Тиаминпирофосфат', 'Cc1ncc(C[n+]2csc(CCOP(=O)([O-])OP(=O)([O-])O)c2C)c(N)n1'),
    'riboflavin': ('Рибофлавин (B2)', 'CC1=CC2=C(C=C1C)N(C[C@H](O)[C@H](O)[C@H](O)CO)C1=NC(=O)NC(=O)C1=N2'),
    'fad': ('ФАД', 'CC1=CC2=C(C=C1C)N(CC(O)C(O)C(O)COP(=O)(O)OP(=O)(O)OCC3OC(n4cnc5c(N)ncnc54)C(O)C3O)C3=NC(=O)NC(=O)C3=N2'),
    'niacin': ('Никотиновая кислота (B3, PP)', 'OC(=O)c1cccnc1'),
    'nicotinamide': ('Никотинамид', 'NC(=O)c1cccnc1'),
    'nad': ('НАД⁺', 'NC(=O)c1ccc[n+](c1)C1OC(COP(=O)([O-])OP(=O)(O)OCC2OC(n3cnc4c(N)ncnc43)C(O)C2O)C(O)C1O'),
    'nicox': ('Никотинамид (окисл.)', 'NC(=O)c1ccc[n+](C)c1'),
    'nicred': ('Никотинамид (восст.)', 'NC(=O)C1=CN(C)C=CC1'),
    'pantothenic': ('Пантотеновая кислота (B5)', 'CC(C)(CO)[C@@H](O)C(=O)NCCC(=O)O'),
    'coa': ('Коэнзим А', 'CC(C)(COP(=O)(O)OP(=O)(O)OC[C@H]1O[C@@H](' + RIBO_A + ')[C@H](O)[C@@H]1OP(=O)(O)O)[C@@H](O)C(=O)NCCC(=O)NCCS'),
    'acetylcoa': ('Ацетил-КоА', 'CC(C)(COP(=O)(O)OP(=O)(O)OC[C@H]1O[C@@H](' + RIBO_A + ')[C@H](O)[C@@H]1OP(=O)(O)O)[C@@H](O)C(=O)NCCC(=O)NCCSC(C)=O'),
    'pyridoxine': ('Пиридоксин (B6)', 'Cc1ncc(CO)c(CO)c1O'),
    'plp': ('Пиридоксальфосфат', 'Cc1ncc(COP(=O)(O)O)c(C=O)c1O'),
    'biotin': ('Биотин (B7, H)', 'OC(=O)CCCC[C@@H]1SC[C@@H]2NC(=O)N[C@H]12'),
    'folate': ('Фолиевая кислота (B9)', 'Nc1nc2ncc(CNc3ccc(cc3)C(=O)N[C@@H](CCC(=O)O)C(=O)O)nc2c(=O)[nH]1'),
    'b12': ('Кобаламин (B12), ядро', 'CC%11([N]%21%31)C(C)(C)CC%21=C(C)C(=[N]%22%32)C(C)CC%22=CC(=[N]%23%33)C(C)(C)CC%23=C(C)C(=[N]%24%34)C(C)CC%24%11.[Co]%31%32%33%34(C#N)[n+]5cn(C)c6cc(C)c(C)cc65'),
    'ascorbic': ('Аскорбиновая кислота (C)', 'OC[C@H](O)[C@H]1OC(=O)C(O)=C1O'),
    'retinol': ('Ретинол (A)', 'CC1=C(/C=C/C(C)=C/C=C/C(C)=C/CO)C(C)(C)CCC1'),
    'calciol': ('Холекальциферол (D3)', 'C=C1CC[C@H](O)C/C1=C/C=C1\\CCC[C@]2(C)[C@@H]1CC[C@@H]2[C@H](C)CCCC(C)C'),
    'calcitriol': ('Кальцитриол', 'C=C1[C@@H](O)C[C@H](O)C/C1=C/C=C1\\CCC[C@]2(C)[C@@H]1CC[C@@H]2[C@H](C)CCCC(C)(C)O'),
    'tocopherol': ('α-Токоферол (E)', 'Cc1c(C)c2O[C@](C)(CCC[C@H](C)CCC[C@H](C)CCCC(C)C)CCc2c(C)c1O'),
    'phylloquinone': ('Филлохинон (K1)', 'CC1=C(C/C=C(\\C)CCC[C@H](C)CCC[C@H](C)CCCC(C)C)C(=O)c2ccccc2C1=O'),
    # энергия и углеводы
    'atp': ('АТФ', 'Nc1ncnc2n(cnc12)[C@@H]1O[C@H](COP(=O)(O)OP(=O)(O)OP(=O)(O)O)[C@@H](O)[C@H]1O'),
    'adp': ('АДФ', 'Nc1ncnc2n(cnc12)[C@@H]1O[C@H](COP(=O)(O)OP(=O)(O)O)[C@@H](O)[C@H]1O'),
    'amp': ('АМФ', 'Nc1ncnc2n(cnc12)[C@@H]1O[C@H](COP(=O)(O)O)[C@@H](O)[C@H]1O'),
    'camp': ('цАМФ', 'Nc1ncnc2n(cnc12)[C@@H]1O[C@@H]2COP(=O)(O)O[C@H]2[C@H]1O'),
    'pi': ('Фосфат', 'OP(=O)(O)O'),
    'glucose': ('Глюкоза', 'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O'),
    'g6p': ('Глюкозо-6-фосфат', 'O[C@@H]1O[C@H](COP(=O)(O)O)[C@@H](O)[C@H](O)[C@H]1O'),
    'g1p': ('Глюкозо-1-фосфат', 'OC[C@H]1O[C@H](OP(=O)(O)O)[C@H](O)[C@@H](O)[C@@H]1O'),
    'f6p': ('Фруктозо-6-фосфат', 'OC[C@]1(O)O[C@H](COP(=O)(O)O)[C@@H](O)[C@@H]1O'),
    'f16bp': ('Фруктозо-1,6-бисфосфат', 'O[C@]1(COP(=O)(O)O)O[C@H](COP(=O)(O)O)[C@@H](O)[C@@H]1O'),
    'dhap': ('Дигидроксиацетонфосфат', 'OCC(=O)COP(=O)(O)O'),
    'gap': ('Глицеральдегид-3-фосфат', 'O=C[C@H](O)COP(=O)(O)O'),
    'bpg13': ('1,3-Бисфосфоглицерат', 'O=C(OP(=O)(O)O)[C@H](O)COP(=O)(O)O'),
    'pg3': ('3-Фосфоглицерат', 'OC(=O)[C@H](O)COP(=O)(O)O'),
    'pg2': ('2-Фосфоглицерат', 'OC(=O)[C@H](CO)OP(=O)(O)O'),
    'pep': ('Фосфоенолпируват', 'OC(=O)C(=C)OP(=O)(O)O'),
    'pyruvate': ('Пируват', 'CC(=O)C(=O)O'),
    'lactate': ('Лактат', 'C[C@H](O)C(=O)O'),
    'ethanol': ('Этанол', 'CCO'),
    'acetaldehyde': ('Ацетальдегид', 'CC=O'),
    'acetate': ('Ацетат', 'CC(=O)O'),
    'ribose5p': ('Рибозо-5-фосфат', 'O[C@H]1O[C@H](COP(=O)(O)O)[C@@H](O)[C@H]1O'),
    'fructose': ('Фруктоза', 'OC[C@]1(O)O[C@H](CO)[C@@H](O)[C@@H]1O'),  # β-D-фруктофураноза, C6H12O6
    'sucrose': ('Сахароза', 'OC[C@H]1O[C@@](CO)(O[C@H]2O[C@H](CO)[C@@H](O)[C@H](O)[C@H]2O)[C@@H](O)[C@@H]1O'),
    'co2': ('CO₂', 'O=C=O'), 'h2o': ('Вода', 'O'), 'o2': ('Кислород', 'O=O'), 'nh3': ('Аммиак', 'N'), 'urea': ('Мочевина', 'NC(N)=O'),
    'co': ('Угарный газ', '[C-]#[O+]'), 'cn': ('Цианид', '[C-]#N'),
    'citrate': ('Цитрат', 'OC(=O)CC(O)(CC(=O)O)C(=O)O'),
    'isocitrate': ('Изоцитрат', 'OC(=O)C[C@@H]([C@@H](O)C(=O)O)C(=O)O'),
    'akg': ('α-Кетоглутарат', 'OC(=O)CCC(=O)C(=O)O'),
    'succoa': ('Сукцинил-КоА', 'OC(=O)CCC(=O)SC'),
    'acetyl': ('Ацетил-КоА', 'CC(=O)SC'),
    'succinate': ('Сукцинат', 'OC(=O)CCC(=O)O'),
    'fumarate': ('Фумарат', 'OC(=O)/C=C/C(=O)O'),
    'malate': ('Малат', 'OC(=O)C[C@H](O)C(=O)O'),
    'oaa': ('Оксалоацетат', 'OC(=O)CC(=O)C(=O)O'),
    'glycerol': ('Глицерин', 'OCC(O)CO'),
    'dnp': ('2,4-Динитрофенол', 'Oc1ccc(cc1[N+](=O)[O-])[N+](=O)[O-]'),
    # липиды
    'palmitic': ('Пальмитиновая кислота', 'CCCCCCCCCCCCCCCC(=O)O'),
    'stearic': ('Стеариновая кислота', 'CCCCCCCCCCCCCCCCCC(=O)O'),
    'oleic': ('Олеиновая кислота', 'CCCCCCCC/C=C\\CCCCCCCC(=O)O'),
    'elaidic': ('Элаидиновая (транс-жир)', 'CCCCCCCC/C=C/CCCCCCCC(=O)O'),
    'linoleic': ('Линолевая кислота (ω-6)', 'CCCCC/C=C\\C/C=C\\CCCCCCCC(=O)O'),
    'linolenic': ('α-Линоленовая (ω-3)', 'CC/C=C\\C/C=C\\C/C=C\\CCCCCCCC(=O)O'),
    'arachidonic': ('Арахидоновая кислота', 'CCCCC/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)O'),
    'tag': ('Триацилглицерин', 'CCCCCCCCCCCCCCCC(=O)OCC(COC(=O)CCCCCCCCCCCCCCC)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'cholesterol': ('Холестерин', 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'),
    'cholic': ('Холевая кислота', 'C[C@H](CCC(=O)O)[C@H]1CC[C@H]2[C@@H]3[C@H](O)C[C@@H]4C[C@H](O)CC[C@]4(C)[C@H]3C[C@H](O)[C@]12C'),
    'carnitine': ('Карнитин', 'C[N+](C)(C)C[C@@H](O)CC(=O)[O-]'),
    'acetoacetate': ('Ацетоацетат', 'CC(=O)CC(=O)O'),
    'bhb': ('β-Гидроксибутират', 'C[C@@H](O)CC(=O)O'),
    'acetone': ('Ацетон', 'CC(C)=O'),
    'malonyl': ('Малонил-КоА', 'OC(=O)CC(=O)SC'),
    'malonate': ('Малонат', 'OC(=O)CC(=O)O'),
    'hmgcoa': ('ГМГ-КоА', 'OC(=O)C[C@](C)(O)CC(=O)SC'),
    'mevalonate': ('Мевалонат', 'OC(=O)C[C@](C)(O)CCO'),
    'simvastatin': ('Симвастатин', 'CCC(C)(C)C(=O)O[C@H]1C[C@@H](C)C=C2C=C[C@H](C)[C@H](CC[C@@H]3C[C@@H](O)CC(=O)O3)[C@@H]12'),
    # аминокислоты
    'gly': ('Глицин', 'NCC(=O)O'), 'ala': ('Аланин', 'N[C@@H](C)C(=O)O'), 'val': ('Валин', 'N[C@@H](C(C)C)C(=O)O'), 'leu': ('Лейцин', 'N[C@@H](CC(C)C)C(=O)O'),
    'ile': ('Изолейцин', 'N[C@@H]([C@@H](C)CC)C(=O)O'), 'pro': ('Пролин', 'OC(=O)[C@@H]1CCCN1'), 'phe': ('Фенилаланин', 'N[C@@H](Cc1ccccc1)C(=O)O'),
    'trp': ('Триптофан', 'N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O'), 'met': ('Метионин', 'N[C@@H](CCSC)C(=O)O'), 'ser': ('Серин', 'N[C@@H](CO)C(=O)O'),
    'thr': ('Треонин', 'N[C@@H]([C@H](O)C)C(=O)O'), 'cys': ('Цистеин', 'N[C@@H](CS)C(=O)O'), 'tyr': ('Тирозин', 'N[C@@H](Cc1ccc(O)cc1)C(=O)O'),
    'asn': ('Аспарагин', 'N[C@@H](CC(N)=O)C(=O)O'), 'gln': ('Глутамин', 'N[C@@H](CCC(N)=O)C(=O)O'), 'asp': ('Аспартат', 'N[C@@H](CC(=O)O)C(=O)O'),
    'glu': ('Глутамат', 'N[C@@H](CCC(=O)O)C(=O)O'), 'lys': ('Лизин', 'N[C@@H](CCCCN)C(=O)O'), 'arg': ('Аргинин', 'N[C@@H](CCCNC(N)=N)C(=O)O'),
    'his': ('Гистидин', 'N[C@@H](Cc1c[nH]cn1)C(=O)O'),
    'dopamine': ('Дофамин', 'NCCc1ccc(O)c(O)c1'), 'adrenaline': ('Адреналин', 'CNC[C@H](O)c1ccc(O)c(O)c1'), 'noradrenaline': ('Норадреналин', 'NC[C@H](O)c1ccc(O)c(O)c1'),
    'serotonin': ('Серотонин', 'NCCc1c[nH]c2ccc(O)cc12'), 'histamine': ('Гистамин', 'NCCc1c[nH]cn1'), 'gaba': ('ГАМК', 'NCCCC(=O)O'),
    'ornithine': ('Орнитин', 'NCCC[C@H](N)C(=O)O'), 'citrulline': ('Цитруллин', 'NC(=O)NCCC[C@H](N)C(=O)O'),
    'argsucc': ('Аргининосукцинат', 'NC(=NCCC[C@H](N)C(=O)O)N[C@@H](CC(=O)O)C(=O)O'), 'carbp': ('Карбамоилфосфат', 'NC(=O)OP(=O)(O)O'),
    'creatine': ('Креатин', 'CN(CC(=O)O)C(N)=N'), 'creatinine': ('Креатинин', 'CN1CC(=O)NC1=N'),
    'gsh': ('Глутатион', 'N[C@@H](CCC(=O)N[C@@H](CS)C(=O)NCC(=O)O)C(=O)O'),
    # нуклеотиды
    'adenine': ('Аденин', 'Nc1ncnc2[nH]cnc12'), 'guanine': ('Гуанин', 'Nc1nc2[nH]cnc2c(=O)[nH]1'), 'cytosine': ('Цитозин', 'Nc1cc[nH]c(=O)n1'),
    'thymine': ('Тимин', 'Cc1c[nH]c(=O)[nH]c1=O'), 'uracil': ('Урацил', 'O=c1cc[nH]c(=O)[nH]1'),
    'hypoxanthine': ('Гипоксантин', 'O=c1[nH]cnc2nc[nH]c12'), 'xanthine': ('Ксантин', 'O=c1[nH]c(=O)c2[nH]cnc2[nH]1'),
    'urate': ('Мочевая кислота', 'O=c1[nH]c(=O)c2[nH]c(=O)[nH]c2[nH]1'), 'allopurinol': ('Аллопуринол', 'O=c1[nH]cnc2[nH]ncc12'),
    'methotrexate': ('Метотрексат', 'CN(Cc1cnc2nc(N)nc(N)c2n1)c1ccc(cc1)C(=O)N[C@@H](CCC(=O)O)C(=O)O'),
    'fu': ('5-Фторурацил', 'Fc1c[nH]c(=O)[nH]c1=O'),
    # гормоны и сигналы
    'cortisol': ('Кортизол', 'C[C@]12CCC(=O)C=C1CC[C@@H]1[C@@H]2[C@@H](O)C[C@@]2(C)[C@H]1CC[C@]2(O)C(=O)CO'),
    'estradiol': ('Эстрадиол', 'C[C@]12CC[C@H]3[C@@H](CCc4cc(O)ccc34)[C@@H]1CC[C@@H]2O'),
    'testosterone': ('Тестостерон', 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@@H]2O'),
    'progesterone': ('Прогестерон', 'CC(=O)[C@H]1CC[C@H]2[C@@H]3CCC4=CC(=O)CC[C@]4(C)[C@H]3CC[C@]12C'),
    'doc': ('11-Дезоксикортикостерон', 'C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2C(=O)CO)CCC4=CC(=O)CC[C@]34C'),
    'corticosterone': ('Кортикостерон', 'C[C@]12CCC(=O)C=C1CC[C@@H]3[C@@H]2[C@H](C[C@]4([C@H]3CC[C@@H]4C(=O)CO)C)O'),
    'ohprog': ('17α-Гидроксипрогестерон', 'CC(=O)[C@]1(CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CCC4=CC(=O)CC[C@]34C)C)O'),
    'deoxycortisol': ('11-Дезоксикортизол', 'C[C@]12CCC(=O)C=C1CC[C@@H]3[C@@H]2CC[C@]4([C@H]3CC[C@@]4(C(=O)CO)O)C'),
    'androstenedione': ('Андростендион', 'C[C@]12CC[C@H]3[C@H]([C@@H]1CCC2=O)CCC4=CC(=O)CC[C@]34C'),
    'cortisone': ('Кортизон', 'C[C@]12CCC(=O)C=C1CC[C@@H]3[C@@H]2C(=O)C[C@]4([C@H]3CC[C@@]4(C(=O)CO)O)C'),
    'mifepristone': ('Мифепристон', 'CC#C[C@@]1(CC[C@@H]2[C@@]1(C[C@@H](C3=C4CCC(=O)C=C4CC[C@@H]23)c5ccc(cc5)N(C)C)C)O'),
    'spironolactone': ('Спиронолактон', 'CC(=O)S[C@@H]1CC2=CC(=O)CC[C@@]2([C@@H]3[C@@H]1[C@@H]4CC[C@]5([C@]4(CC3)C)CCC(=O)O5)C'),
    'aldosterone': ('Альдостерон', 'C[C@]12CCC(=O)C=C1CC[C@@H]1[C@@H]2[C@@H](O)C[C@]2(C=O)[C@H]1CC[C@@H]2C(=O)CO'),
    'thyroxine': ('Тироксин (T4)', 'N[C@@H](Cc1cc(I)c(Oc2cc(I)c(O)c(I)c2)c(I)c1)C(=O)O'),
    't3': ('Трийодтиронин (T3)', 'N[C@@H](Cc1cc(I)c(Oc2ccc(O)c(I)c2)c(I)c1)C(=O)O'),
    'pge2': ('Простагландин E2', 'CCCCC[C@H](O)/C=C/[C@H]1[C@H](O)CC(=O)[C@@H]1C/C=C\\CCCC(=O)O'),
    'aspirin': ('Аспирин', 'CC(=O)Oc1ccccc1C(=O)O'),
    'ip3': ('Инозитолтрифосфат', 'O[C@@H]1[C@H](O)[C@@H](OP(=O)(O)O)[C@H](OP(=O)(O)O)[C@@H](O)[C@H]1OP(=O)(O)O'),
    # кровь, печень, лекарства
    'bilirubin': ('Билирубин', 'CC1=C(C=C)/C(=C/c2[nH]c(Cc3[nH]c(/C=C4\\NC(=O)C(C=C)=C4C)c(C)c3CCC(=O)O)c(CCC(=O)O)c2C)NC1=O'),
    'bpg23': ('2,3-Бисфосфоглицерат', 'OC(=O)[C@H](COP(=O)(O)O)OP(=O)(O)O'),
    'paracetamol': ('Парацетамол', 'CC(=O)Nc1ccc(O)cc1'), 'napqi': ('NAPQI', 'CC(=O)N=C1C=CC(=O)C=C1'),
    'glucuronic': ('Глюкуроновая кислота', 'O[C@@H]1O[C@@H]([C@@H](O)[C@H](O)[C@H]1O)C(=O)O'),
    'caffeine': ('Кофеин', 'Cn1cnc2c1c(=O)n(C)c(=O)n2C'),
    'warfarin': ('Варфарин', 'CC(=O)C[C@H](c1ccccc1)c1c(O)c2ccccc2oc1=O'),
    'penicillin': ('Пенициллин G', 'CC1(C)S[C@@H]2[C@H](NC(=O)Cc3ccccc3)C(=O)N2[C@H]1C(=O)O'),
    'chloramphenicol': ('Левомицетин', 'OC[C@@H](NC(=O)C(Cl)Cl)[C@H](O)c1ccc(cc1)[N+](=O)[O-]'),
    'linezolid': ('Линезолид', 'CC(=O)NC[C@H]1CN(C(=O)O1)c1ccc(N2CCOCC2)c(F)c1'),
    'ciprofloxacin': ('Ципрофлоксацин', 'OC(=O)C1=CN(C2CC2)c2cc(N3CCNCC3)c(F)cc2C1=O'),
    'gentamicin': ('Гентамицин C1a', 'NC[C@@H]1CC[C@@H](N)[C@@H](O1)O[C@H]1[C@H](N)C[C@@H](N)[C@@H](O[C@H]2OC[C@](C)(O)[C@H](NC)[C@H]2O)[C@@H]1O'),
    'metformin': ('Метформин', 'CN(C)C(=N)NC(N)=N'),
    'benzene': ('Бензол', 'c1ccccc1'), 'phenol': ('Фенол', 'Oc1ccccc1'), 'sulfate': ('Сульфат', 'OS(=O)(=O)O'), 'methanol': ('Метанол', 'CO'),
    'ala5': ('5-Аминолевулиновая кислота', 'NCC(=O)CCC(=O)O'),
    'pbg': ('Порфобилиноген', 'NCc1[nH]cc(CCC(=O)O)c1CC(=O)O'),
    'hmbilane': ('Гидроксиметилбилан', 'OCc1[nH]c(Cc2[nH]c(Cc3[nH]c(Cc4[nH]cc(CCC(=O)O)c4CC(=O)O)c(CCC(=O)O)c3CC(=O)O)c(CCC(=O)O)c2CC(=O)O)c(CCC(=O)O)c1CC(=O)O'),
    'urogen3': ('Уропорфириноген III', 'C1c2[nH]c(Cc3[nH]c(Cc4[nH]c(Cc5[nH]c1c(CC(=O)O)c5CCC(=O)O)c(CCC(=O)O)c4CC(=O)O)c(CCC(=O)O)c3CC(=O)O)c(CCC(=O)O)c2CC(=O)O'),
    'coprogen3': ('Копропорфириноген III', 'C1c2[nH]c(Cc3[nH]c(Cc4[nH]c(Cc5[nH]c1c(C)c5CCC(=O)O)c(CCC(=O)O)c4C)c(CCC(=O)O)c3C)c(CCC(=O)O)c2C'),
    'biliverdin': ('Биливердин', 'CC1=C(C=C)/C(=C/C2=NC(=Cc3[nH]c(/C=C4\\NC(=O)C(C=C)=C4C)c(C)c3CCC(=O)O)C(CCC(=O)O)=C2C)NC1=O'),
    'gla': ('γ-Карбоксиглутамат', 'N[C@@H](CC(C(=O)O)C(=O)O)C(=O)O'),
    'h2co3': ('Угольная кислота', 'OC(=O)O'),
    'disulfiram': ('Дисульфирам', 'CCN(CC)C(=S)SSC(=S)N(CC)CC'),
    'nac': ('Ацетилцистеин', 'CC(=O)N[C@@H](CS)C(=O)O'),
    'fomepizole': ('Фомепизол', 'Cc1cn[nH]c1'),
    'tranexamic': ('Транексамовая кислота', 'NCC1CCC(CC1)C(=O)O'),
    'phenobarbital': ('Фенобарбитал', 'CCC1(c2ccccc2)C(=O)NC(=O)NC1=O'),
    # --- новые темы (радикалы, углеводы, липогенез, амины, антибиотики, гормоны, эйкозаноиды, азот крови)
    'h2o2': ('Пероксид водорода', 'OO'),
    'mda': ('Малоновый диальдегид', 'O=CCC=O'),
    'gssg': ('Глутатион окисленный (GSSG)', 'N[C@@H](CCC(=O)N[C@@H](CSSC[C@H](NC(=O)CC[C@H](N)C(=O)O)C(=O)NCC(=O)O)C(=O)NCC(=O)O)C(=O)O'),
    'galactose': ('Галактоза', 'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@H]1O'),
    'lactose': ('Лактоза', 'OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O)O[C@@H]2CO)[C@H](O)[C@@H](O)[C@H]1O'),
    'maltose': ('Мальтоза', 'OC[C@H]1O[C@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O)O[C@@H]2CO)[C@H](O)[C@@H](O)[C@@H]1O'),
    'gal1p': ('Галактозо-1-фосфат', 'OC[C@H]1O[C@H](OP(=O)(O)O)[C@H](O)[C@@H](O)[C@H]1O'),
    'galactitol': ('Галактитол', 'OC[C@@H](O)[C@H](O)[C@H](O)[C@@H](O)CO'),
    'f1p': ('Фруктозо-1-фосфат', 'O[C@]1(COP(=O)(O)O)O[C@H](CO)[C@@H](O)[C@@H]1O'),  # фуранозная форма, как фруктоза и Ф-1,6-БФ
    'g3p': ('Глицерол-3-фосфат', 'OC[C@@H](O)COP(=O)(O)O'),
    'pa': ('Фосфатидная кислота', 'CCCCCCCCCCCCCCCC(=O)OC[C@H](COP(=O)(O)O)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'dag': ('Диацилглицерол', 'CCCCCCCCCCCCCCCC(=O)OC[C@H](CO)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'choline': ('Холин', 'C[N+](C)(C)CCO'),
    'pe': ('Фосфатидилэтаноламин', 'CCCCCCCCCCCCCCCC(=O)OC[C@H](COP(=O)(O)OCCN)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'ptdins': ('Фосфатидилинозитол', 'CCCCCCCCCCCCCCCC(=O)OC[C@H](COP(=O)(O)O[C@H]1[C@H](O)[C@@H](O)[C@H](O)[C@@H](O)[C@H]1O)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'cdpdag': ('ЦДФ-диацилглицерол', 'CCCCCCCCCCCCCCCC(=O)OC[C@H](COP(=O)(O)OP(=O)(O)OC[C@H]1O[C@@H](n2ccc(N)nc2=O)[C@H](O)[C@@H]1O)OC(=O)CCCCCCC/C=C\\CCCCCCCC'),
    'dopa': ('ДОФА', 'N[C@@H](Cc1ccc(O)c(O)c1)C(=O)O'),
    'htp': ('5-Гидрокситриптофан', 'N[C@@H](Cc1c[nH]c2ccc(O)cc12)C(=O)O'),
    'melatonin': ('Мелатонин', 'CC(=O)NCCc1c[nH]c2ccc(OC)cc12'),
    'tetracycline': ('Тетрациклин', 'CN(C)[C@@H]1[C@@H]2C[C@@H]3C(=C(O)c4c(O)cccc4[C@@]3(C)O)C(=O)[C@]2(O)C(O)=C(C(N)=O)C1=O'),
    'streptomycin': ('Стрептомицин', 'CN[C@H]1[C@H](O)[C@@H](O)[C@H](CO)O[C@H]1O[C@@H]1[C@@H](O[C@@H]2[C@@H](O)[C@H](O)[C@@H](NC(N)=N)[C@H](O)[C@H]2NC(N)=N)O[C@@H](C)[C@]1(O)C=O'),
    'erythromycin': ('Эритромицин', 'CC[C@@H]1[C@@]([C@@H]([C@H](C(=O)[C@@H](C[C@@]([C@@H]([C@H]([C@@H]([C@H](C(=O)O1)C)O[C@H]2C[C@@]([C@H]([C@@H](O2)C)O)(C)OC)C)O[C@H]3[C@@H]([C@H](C[C@H](O3)C)N(C)C)O)(C)O)C)C)O)(C)O'),
    'mit': ('Монойодтирозин', 'N[C@@H](Cc1ccc(O)c(I)c1)C(=O)O'),
    'dit': ('Дийодтирозин', 'N[C@@H](Cc1cc(I)c(O)c(I)c1)C(=O)O'),
    'trh': ('Тиреолиберин (ТРГ)', 'NC(=O)[C@@H]1CCCN1C(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@@H]1CCC(=O)N1'),
    'ptu': ('Пропилтиоурацил', 'CCCc1cc(=O)[nH]c(=S)[nH]1'),
    'pregnenolone': ('Прегненолон', 'CC(=O)[C@H]1CC[C@H]2[C@@H]3CC=C4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C'),
    'dhea': ('ДГЭА', 'C[C@]12CC[C@H]3[C@@H](CC=C4C[C@@H](O)CC[C@]34C)[C@@H]1CCC2=O'),
    'dhc7': ('7-Дегидрохолестерин', 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3C2=CC=C4[C@@]3(CC[C@@H](C4)O)C)C'),
    'calcidiol': ('Кальцидиол (25-OH-D3)', 'C=C1CC[C@H](O)C/C1=C/C=C1\\CCC[C@]2(C)[C@@H]1CC[C@@H]2[C@H](C)CCCC(C)(C)O'),
    'pgh2': ('Простагландин H2', 'CCCCC[C@H](O)/C=C/[C@H]1[C@H]2C[C@H](OO2)[C@@H]1C/C=C\\CCCC(=O)O'),
    'txa2': ('Тромбоксан A2', 'CCCCC[C@H](O)/C=C/[C@H]1OC2CC(O2)[C@@H]1C/C=C\\CCCC(=O)O'),
    'pgi2': ('Простациклин', 'CCCCC[C@H](O)/C=C/[C@@H]1[C@H](O)C[C@@H]2O/C(=C\\CCCC(=O)O)C[C@@H]12'),
    'ltb4': ('Лейкотриен B4', 'CCCCC/C=C\\C[C@@H](O)/C=C/C=C/C=C\\[C@@H](O)CCCC(=O)O'),
    'celecoxib': ('Целекоксиб', 'Cc1ccc(cc1)-c1cc(nn1-c1ccc(cc1)S(N)(=O)=O)C(F)(F)F'),
    'ibuprofen': ('Ибупрофен', 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'),
    'hiaa': ('5-Гидроксииндолуксусная кислота', 'OC(=O)Cc1c[nH]c2ccc(O)cc12'),
    'hva': ('Гомованилиновая кислота', 'COc1cc(CC(=O)O)ccc1O'),
    'vma': ('Ванилилминдальная кислота', 'COc1cc(C(O)C(=O)O)ccc1O'),
    'tyramine': ('Тирамин', 'NCCc1ccc(O)cc1'),
    'hcy': ('Гомоцистеин', 'N[C@@H](CCS)C(=O)O'),
    'udpglc': ('УДФ-глюкоза', 'O=c1ccn([C@@H]2O[C@H](COP(=O)(O)OP(=O)(O)O[C@H]3O[C@H](CO)[C@@H](O)[C@H](O)[C@H]3O)[C@@H](O)[C@H]2O)c(=O)[nH]1'),
    'udpgal': ('УДФ-галактоза', 'O=c1ccn([C@@H]2O[C@H](COP(=O)(O)OP(=O)(O)O[C@H]3O[C@H](CO)[C@H](O)[C@H](O)[C@H]3O)[C@@H](O)[C@H]2O)c(=O)[nH]1'),
    'glyald': ('Глицеральдегид', 'OC[C@@H](O)C=O'),
    'pcr': ('Креатинфосфат', 'CN(CC(=O)O)C(=N)NP(=O)(O)O'),
}

# жирные кислоты и ацилглицерины — вытянутые конформеры через RDKit (tools/molrd.py)
EXT = {'palmitic', 'stearic', 'oleic', 'elaidic', 'linoleic', 'linolenic', 'arachidonic', 'tag', 'pa', 'dag', 'pe', 'ptdins', 'cdpdag'}
Q = 100.0
def one(item):
    k, (name, smi) = item
    try:
        if k in EXT:
            import molrd
            r = molrd.build(smi)
        else:
            r = molgen.embed(smi, seed=7, tries=int(os.environ.get('TRIES', '4')))
    except Exception as e:
        return k, None, str(e)
    el = r['el']; P = r['xyz']; B = r['bonds']
    d = {'name': name, 'el': ' '.join(el), 'xyz': base64.b64encode(np.round(P * Q).astype('<i2').tobytes()).decode(),
         'b': base64.b64encode(np.array([[a, b] for a, b, o in B], dtype='<u2').tobytes()).decode(), 'o': ''.join(str(o) for a, b, o in B)}
    return k, d, f"n={len(el)} E={r['E']:.2f}" + ('' if k in EXT else f" close={molgen.check(r)}")

if __name__ == '__main__':
    out_path = sys.argv[1]; only = sys.argv[2:]
    old = json.load(open(out_path)) if os.path.exists(out_path) else {}
    items = [(k, v) for k, v in LIB.items() if (not only and k not in old) or k in only]
    items.sort(key=lambda kv: -len(kv[1][1]))
    with Pool(2) as p:
        for k, d, info in p.imap_unordered(one, items):
            print(k, info, flush=True)
            if d: old[k] = d; json.dump(old, open(out_path, 'w'), separators=(',', ':'), ensure_ascii=False)
    print('done', len(old))
