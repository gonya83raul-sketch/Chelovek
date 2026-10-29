import { Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, scopeShow, seg, smooth, taperTube, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, bioStage, blobGeo, caPoints, flowArrow, molFit, molMesh, plotAxes, protMat, proteinMesh, schemBilayer } from './kit.js';
Object.assign(BIO_PDB, {"gpcr":{"title":"β2-adrenergic receptor + Gs 3SN6","r":68.7,"chains":[{"id":"A","k":"p","seq":"TEDQRNEEKAQREANKKIEKQLQKDKQVYRATHRLLLLGAGESGKSTIVKQKATKVQDIKNNLKEAIETIVAAMSNLVPPVELANPENQFRVDYILSVMNVPDFDFPPEFYEHAKALWEDEGVRACYERSNEYQLIDCAQYFLDKIDVIKQDDYVPSDQDLLRCRVSGIFETKFQVDKVNFHMFDVGGQRDERRKWIQCFNDVTAIIFVVASSSYNMTNRLQEALNLFKSIWNNRWLRTISVILFLNKQDLLAEKVLAGKSKIEDYFPEFARYTTPEDATPEPGEDPRVTRAKYFIRDEFLRISTASGDGRHYCYPHFTCAVDTENIRRVFNDCRDIIQRMHLRQYELL","num":9,"ss":"CCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHEEEEEECCCCCHHHHHHCCHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCCCHHHHHHHHHHHHHHHCCCCCCCHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCCCHHHHHHHHHHHHHCCCCCHHHHHHHHHCCCCCEEEEEECCEEEEEEECHHHCCCCCHHHHHHCCCCEEEEEEECHHHHCCHHHHHHHHHHHHHHHHCCCCCCEEEEEEEHHHHHHHHHHHHCCHHHHHHHHHHCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHHHHHCCCCCEEEEECCCCCCCHHHHHHHHHHHHHHHHHHHHHCCC","ca":"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","o":"yg5Tt+TCnfIAoyIRph7gnPv+owckqC4KnQDynfQEpyQbpiv5nQr2nwAXqTAMpijxnQv6pRsfrTf9qS3vnxATtT4VrTHmnQIOsCQwvkgWtEACqSMiuS80u0f0nAMFK0rNyMxB51XRKrY1yFL4Sdo5tR7FUtkrUu82szPanPwC0uSs27zBJeSnHKXi7qfW6cmwNLTZGJ/26aHsLqcEMb3JVuDZYOcQWNAJV+nUY/rxXuINU87pWu/YY/T7W9cIV9niYRn9Y/7yVc7xUuPPY/zwYuoCRdHJUgLHWQEtUOM0X//hS0IGCcqtJOant+A9K6b6wSS88vViPszFFqLl3V349UC0rxHI418JCmIT0lLdzlAg72ERBGLs41vi9l4iOkjZDGP1xlEHJw2lIzCv3d9Y6sO0w9u62B1XsNctuuBAVPc2IbtARsAeW+chLd5TNMpCVuAoUvc5POhMRsEiWOMlJPddKrs7BFwoJDhKPEckI1ocEUhDPDU9MVMaA1cwKiFVQUjp/1zYFl4ZLVfu5Ppg6uygFzFUE58OHK4y4yOnuNLNzqr0vLcEvdPF97DEy6sIoRLntyvMrPPMoBTuzD7G2CasHVoh7GH01SNT8VHH7NRYwEwLVB/USEDjYRYHUQvGPEHRREUYXRfkGjmyQLQKWCoV7LxHs//Bn+v1rynV/KQn7lnWC50JElLJvdE5NUHKCjqvMxKs0A5XDljTB6QnJlrsPLIRzVX0UM4gOjk6ABJiXewdnwAa9P+dx0fWQrbzCNOnEA6eIPCj8bu5x/SvDPudIsO5tTse0DK41si472L0z0vUK68nvEn3Q+REqiLaPe9NsvzCJFkb2VwH6BNfRTA2IFsYQkQgzMXDTC3RQTTJROK9IPuiOSe3Tw7EOuqxJQ+kPB+2S/HANO+sLBmqSxTBQu23DwyeQ0Pgy9S49fKe+rPAoeH4qiHZ1Me76Uo/KKgZsj3yM9BHqfzPPwZNrtLd4F4L5FE0z1IftjYo1zhI3U4zv0cauDUt4kg/1lYcri0ivSRBF2H0HlwZ5726TTQmXx4FLVn1O1ALWQrTrOLTnxb20Qqot+DDnQn06R6k1tVQTgPCvz/UvMMnpdjzCKDmoAnmOrANvuS65kVDSMgqJvBb4jayZP76SSzLVTDpYwjyVgXNTCvPWiXrYgPtRCK/SjvhWiPnWgLVPznLUjn6WQHTOwyxKETCSC7MOQCu90S3EVnVMUrS7RSgC/yd6LLGFKPh2Vv0OrQdrzbqKrY12d6rMS9J4L68Bk0/7Ntb0NdNITi0MUHGTNAsyiq3KkvOQyvDHiepFD+1MUTKQzDHFDStI1PVOzzKMCKvGD61JVDROiy8ECimHlvjLk/YKDO0CDuvHlXWSS/O3RynyUnXnfL9xDo3","brk":[51,166,217]},{"id":"B","k":"p","seq":"QSELDQLRQEAEQLKNQIRDARKACADATLSQITNNIDPVGRIQMRTRRTLRGHLAKIYAMHWGTDSRLLVSASQDGKLIIWDSYTTNKVHAIPLRSSWVMTCAYAPSGNYVACGGLDNICSIYNLKTREGNVRVSRELAGHTGYLSCCRFLDDNQIVTSSGDTTCALWDIETGQQTTTFTGHTGDVMSLSLAPDTRLFVSGACDASAKLWDVREGMCRQTFTGHESDINAICFFPNGNAFATGSDDATCRLFDLRADQELMTYSHDNIICGITSVSFSKSGRLLLAGYDDFNCNVWDALKADRAGVLAGHDNRVSCLGVTDDGMAVATGSWDSFLKIWN","num":1,"ss":"CHHHHHHHHHHHHHHHHHHHHHHHHCCCHHHHHHCCCCCCCCCCCCEEEEEECCCCCEEEEEECCCCCEEEEEECCCEEEEEECCCCEEEEEEECCCCCEEEEEECCCCCEEEEEECCCCEEEEECCCCCCCCCEEEEECCCCCCEEEEEECCCCEEEEEECCCCEEEEECCCCEEEEEECCCCCCEEEEEECCCCCEEEEEECCCCEEEEECCCCCEEEEECCCCCCEEEEEECCCCCEEEEEECCCCEEEEECCCCEEEEEECCCCCCCCEEEEEECCCCCEEEEEECCCCEEEEECCCCCEEEEECCCCCCEEEEEECCCCCCEEEEECCCEEEEEC","ca":"s/9OAT0E1P91AQUEDABCAfsDBgA/Aa8DEQCKAa4DUwCEAdMDZwBMAaMDWQB1AWUDfQCvAYUDvACFAZADtQBqAUoDsQCwASwD7QDGAVQDFQGJAT8DAwGYAfcCHQHfAQIDXgHEASADawGWAeUCWQHPAbYCjgH8AdYCwgHFAd8CvAG6AZQCvAEFAoYC/wEIAqoCIwLVAX0CCQL9AUICRwIqAj8CTQIcAvQBJQICAroBOALJAYoBKQL7AVMBXAIsAm8BlgL8AXEBiALdAS0BhAIhAgwBzQIgAvMAzALXAd0AywLMAZIAhAK2AX0AcQJ2AVkAXQKhAR4AIAKNAfX/KwJEAeT/8wEWAc3/7AHKAMr/zQGgAJP/oAFjAJD/ywElAIX/kgH1/5T/RwHy/5D/KQG1/7P/4QCj/6L/xgBn/8X/jgCJ/+r/QwCL/9z/MwC//xEAUwD5/zYAlQDp/1kAkgD7/6MA3ADv/7UAHgHM/6UAYgG7/8IAqQGt/6kAzQFs/7kADwJ1/94ALQJT/6EAHgKU/3sAAgJp/0IAvQFN/1MAhAF5/2wAQAFs/40AAAGR/3sAuACM/5MAeQCh/24ALgCr/30AIgBz/0sANgBD/4IAdwAv/18AvAAz/30A8wA0/0gAPQEn/1IAZAFE/xgAqwFF////wAGM/+7/9wF7/73/0gFH/5L/jgFo/6D/cwEh/6v/QwED/93/ZAHZ/hIAIwHQ/jkA2ADc/jkAtADR/nsAaADU/n4AUQD2/r4AFADj/uUAAAAs//AA/f9U/68ACgCU/9UAUgCY/+oAcQDY/wUBuQDA/w0B7wCM/wQBNwGC/xgBdAFZ/wIBnQEx/zQB5wFC/zkB9wH7/iQBxgH+/usAqgG9/gYBZwHX/h4BNgEM/wcBAQEv/zEBwABU/yABhABz/0MBSQCh/zkB//+r/0kB//9i/14BJAB5/50BVAA+/5UBnQA4/4QBpwD9/lQB7gDg/lIB/QC1/hUBOQGH/g4BXQGP/ssAjQFV/tsAVgEg/tsAcQHe/cEALwG7/bgAFAHt/YYAAAE1/nkA+gBq/q4AwQBe/t8ArgCF/h0B4gBz/lEBxgCX/o4BjwDM/pQBkQD4/tIBUgAa/+gBVQBC/ygCPACB/wgC+/+m/xICCQDQ/9QBJwDN/44BcQC//4YBkgD9/2oB2wDp/2sBDQG1/4MBVgGe/4ABgQFh/48BtAFl/8YByAEf/7EBpwHf/pgBigHU/t4BawEU//sBRwFK/9MBMAGR/+MB7gCt/8kBxgDv/8wBegD0/8gBPAAgAMYBMAACAAoCWQA8ACQCkQAPADwC0ADu/yEC5ACn/zQCIQF6/zICDgEy/yQCMQHu/iQCHgHJ/uUBLAGD/gACBQGM/kAC0QCz/hkCxQDj/lIC2wAq/2QCHgEx/4cCEAF6/5cC3gCy/40C6gD8/4ACsgAsAJECpQB2AJsCmQCPAFQCWgC6AFACRwCiAAoCUABsANUBmgBbAM4BpwBiAIQB8ABNAH4BLgE3AKMBegE1AJcBrAEHALoB8wEXANABMAL9/6oBPgLW/+oB9QHI//gB/wHj/z4CxAESADgCkgEsAAMCaQFpAPMBIgFuANkB9QCjALkBqwCnAMsBawDNAMEBdwD3AAACqAAfAdYB4gAHAQICGAHTAPkBLgGoADMCcQGGAEECawFDAGQCmgEOAIACkgHF/2wCqgGp/68CiwHa/+ACSgHi/7oCQwErAM0CRAFtAKYChQGTALICdgHSAIoCOwHzAGcCSAEhAS0CEwFRARUCHgGBAdwB5ABuAbABoACPAaUBfQBQAY0BgQAEAYwBxgDmAH8BvwC2AEUBBgGaAEEBRgGaAGkBjgGHAFgBzwGDAH8BDwKpAG0BSAJ6AFgBcgKIAJcBNgJ+AMQBOALBAOgB/gHhAMABwQHRAJcBkgHuAGIBRgHxAGEBEwH+ACsBzwAbAT8BjAA0ASYBpAB6ATYByABuAfQADQF4ARQBRAFHASYBaQFTAWcBrQE/AYIBswEvAcwB9AEjAfIB8gHzACwCKwIQAVUCEgJXAUoCygE+AVgCqwFvASUCnAF7AdwB2gGWAbgBuwGnAXUBfQGoAUkBeAGVAQABPAG2Ad8AJgHfAaMA8gAVApcA2QDsAVwAzgCsAYMAjQCnAasAiQBbAakAoQAsAeAA3gAAAd0AzgC2ANcAFQGbAN8AXQGvAOwApAGVAO4A7QGqAOoAJwKZAL0AZgJyAM8AigKvAOoASgLPAAQBVQIPAd0AFQIEAbQA0AH+ANIAnQHeAKQAUgHnAK4AFgHPAIcA2QD9AIMAjwD3AHUAnwAiATgAuADjABQA/wAAAREAOgHvAD0AZAEnAVwArgEfAWcAxgFPAZ0ACQJjAboACwJIAQEBOwKBARMBLQK/AeoA4AG1AeoA2gHBAZ8AuQGOAXEA8gFuAUkAwwFQARUAggEtAQcAZwHsAOr/NAHxALP/DAGxALP/zgCMAMb/iwCrALL/cACdAPf/iACrAD4AygCMAFEAvABdAIsAAgFFAJwATAFWAJUAjQEzAKYA2AE2AJoAAgL4/5IAMALm/8wAawLz/58ATAI1AIsAVAIiAEIACgIqADEAxwFIAEQAggEnAD4APQFHAEEA+gAkAEMAuQBJADIAbgBAAC0AdwAxAOP/kADq//L/1AD8/9X/FwH7//j/TQEqAN7/lwEeAOz/wwFcAOT/DQJtANz/","o":"TyUxUDz+XBzlRAe3PSq9VyPeWwHWNSKyQzfOXgngTPy/Ph23SyvOXAvaRAe3QzDHXRzoUwPJOhSxTSrQYf7nTAXAL0XJUDXlP9+65zixHlneuM4xUifVSurANBWtQTDFXOLmDeag8hGeLwiopibp96s0WOjWEMC13bM1Nwit2ehZUejKwkPXHNFU9/edFLe/6UhBAL+0zjFHAr61yLEa/kW4xT3LYPPm3sVKBmT7DEFL37PJBUJL7re+AgNkL0HEXSUDP/ez9UW5xkDNMTtB0s23FFom5qfbD2P56qgro+Ua36raF60zB2IQFp/5HVoiBa/GL/pY5wOf4DGv9jOrytS4qQbPBUVJ9qXX/Z0L/2Pw6Z/48WAYE7dBvvW2qQLPXx75Qi3D+dxdFy6qMFcNyK0BIl761qb1M0otGQKfThHEIbXH0d2vw7/SQErrvbcJIkK9A89XHzCuAOxir/865bY+EepgACSjGbhBKj290K0bSUTzxcnGEt+jOK0CBhafCuGiysTFTy8m/chTtCfMWxAn4aUa2bQzMlLl0MVBB1bO1b4+6TZRwsXNpiryQLQLJkBC/uueGx2k0N1QFRSg4uxdRTnTYRDvoh/0t7/rn+n8Sh/Fruw1FQOeBBJi78+rGUVEuD0h5f5gPUIt3d6p8QJjCvSd6uNdXB3msc0hptb1vLj2rNsoqCfkUwfJ5e1eEgFi8vmdDR9exvWvWR8iAGMOvcQtoyX4RMYtJlnm9aHk/Meu9TNVA+OgBStaGEi+5aHuE6bYCrlFzb020OpVNfWsxQVQ+6zLAUZI5aHyI1LTukb1F0lBNFULya30LUQ5BMOxAR1gSQa8r+g1ub0UwsMxv+dInAoBVvXO6i9WE0ZF6bm9FVQyyMPJEVQ06VnZ2/1drQQ3XvQgFSin76ow7Z4CCmIT9Z7yDGAYCeWgCMpUD6IgLNZPuPJE4UVCEqDp+F4h6p8KDWLy5b9HGByjyTS+Gl7qLDm60spHH17z9p0C/FwnHKjbyTVB0BpUCyZc11Ujtyg3TNHUAF8gIF702acWL07Xu7kOWR/ertIinxoAy8u+IhZcv+9KYhT/++Og8uph8btHBlDF76Qk+E/D4qjcBBFiCedgICJZzEE32FwFCakw1lLZ88tUBD+z7AthAsGyud/B+iCiMLnM0ttRTAW//clUGU3GMar24lIx7Qpi3TxI4l8BnQv4ObASEUe8KSSs1gVbQfO1rgQ5McVAwiS6Clwnrjr+Ygvw6Z/5/0FMAhdhBBWe9fJiAhSeA+BfLFkOPS8/SibIElrYBh6hAfFjAOag/h5f8++eB00/+J0JptvrAdqjKaX58ktBFNaoCClbBAacJc9PWiIb","brk":[]},{"id":"G","k":"p","seq":"NTASIAQARKLVEQLKMEANIDRIKVSKAAADLMAYCEAHAKEDPLLTPVPASENPFR","num":5,"ss":"HHHHHHHHHHHHHHHHHHHHCCCCHHHHHHHHHHHHHHHHHHHHCCCCCCCCCCCCCC","ca":"jv/bAHQDrP+kAJ8Dvv99AGAD3f++AEkDCQDIAIYDLwCJAHMDPgCpAC8DUQDtAE4DfADLAIIDnwCdAFEDqQDVAB8DxgABAVYD9QDHAGQDCAHFABsDFgEPARQDNwEIAVgDZwHSAD8DdwHvAPsCfAE1ARgDvgEiATgD8AEMAQMDMwIiAegCKwJRAa0CZAJqAYECZgKuAV8CRAKtARwCgwLIAfwBqAKKARICcQJbAfoBbQJ8AbYBuQKDAbEBvwI4Ab0BiQIoAYkBrQJVAVcB7QIwAWkBzgLsAFsBswIDARgB8gImAQEBFQPlABYB7AKvAPQA2gLcALkACgOzAI4A5AJ0AKAAoQKPAIYAkAJ9AD0ATwKkAD8AeALiAE0ApgLaABAAhALDAND/ngJ+AL//vgJ3AHr/kAJJAFL/zgIiAED/2QIOAIn/kAIRAJ7/cQLO/7P/LALk/5z/RQL//1n/","o":"Yg/xW94ZT9zPVhzUXRoaY/X9Wg7XWC3vXSMGYvftUyDTVzELY/gIYv/sVDTwWCkYZAIELTC1OE/l+J0J/WIT/L61NjNDqQDPN7vRDb62LOWqNMfAHrTGENmmN+axM8HFFr25IuykPt65Kb3CFcmvS/++QOO51b3E0QGoC82rxq8LAVzYCTWrykXR81nVBJ0LXhbmrgLHF6gr3aMFBJ33BMpU8dim26jhqgrP4qLw","brk":[]},{"id":"R","k":"p","seq":"EVWVVGMGIVMSLIVLAIVFGNVLVITAIAKFERLQTVTNYFITSLACADLVMGLAVVPFGAAHILTKTWTFGNFWCEFWTSIDVLCVTASIETLCVIAVDRYFAITSPFKYQSLLTKNKARVIILMVWIVSGLTSFLPIQMHWYRQEAINCYAEETCCDFFTNQAYAIASSIVSFYVPLVIMVFVYSRVFQEAKRQLQKIDKSEGRCLKEHKALKTLGIIMGTFTLCWLPFFIVNIVHVIQDNLIRKEVYILLNWIGYVNSGFNPLIYCRSPDFRIAFQELLC","num":30,"ss":"CHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCHHHHHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCHHHHHHHHHCCCCCCCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCHHHHHHHHHHHHHHHHHHHHHHHHCHHHHHHHHHHCCC","ca":"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","o":"Y/4PEvRi98NPCLI+Fd9c6fJg/MNPKL0/I99YA9RaGa0yM8tEEuBdB8hTMbYvMtNKF95bA8BMEr1IKeJWE+VeDMBMKsVEK+1YE+BdE8VPQepJHv1fCrxJNsI4NC9Hus/N1KgRpuMgy+aw/Z7uASKiBvKd1wumEDatKA2lCQadEEa6LiqyIQ+jAB+hGj62KiStBAqdAVDEIkfCFQWe/xCdN1P3Mja9CDqv9R+i3D25/Ui7ARif1yKr3Du4DS6o7Qie0j/BAk3AGf2f1+6nMzBHD82rYO3sNLgtvBlFuAhFy91N4iRYuRtBuPtF0e5W2RVZuRBFu/FH5Atf4BdcvAFJ1udX5BBf1RlXwflN5u5f7vli0AtXyuNP7utg3g1dw+9N3tZU6vhhyApS0tVO8dxc2gZcuvBG39NT8eBewQRNv/FKVc/rZPsAT88mQMnLNNC5Wd3jTcPtO7/QFzBV2yqt+CumA/+c2wOj2h2oBhif8Ouf1gym5B+lCved7O2g2AulExGfCvGe1P+m7S2pDgue4s+uwjDC9vmdG/2gG96m7eehAAacP+C517nHxuyxoefty1Ls3NOuYu7/WyMVWB0lYvEPZAL4WxwgVxQtYvH11ANa+vlk9Fks3aP48lkrC6PctD7tS8IWrzjvIAde+B1f9ONfIwtdBTFX8i9XEQRjLBJYESxY6Q9gFwNhMzhB8w5izCRNxAlQ9Rtg5DNRzSVO1wRb9SNd5jVR0AtX3ANd7UJI2zpJ1xJZ+Rdh6DxMzSpL5BFe/Sta2jhKzB5Q9Rdh7UJJ1zlH3RVbAChc2EJAyxNSKxxWzwip0lQcE13gJtyrRgm5WOLaMrrMLtyvWOTaLrPUDtGpGPefPuW2GdCs+vSdK/SmOMy/Btqk9f2dLgSoDsSxCtmk+RGeDg6e+b224b681vSm2+Cp6qjVzsbA7/ie++SgudHLwQGy/uqe7Miv0s23MEsuohXl1E7U4kVCJNurAclUUuEvOwdQEgFiD+VfMO5WLxBXEP5jINpXNP1VDxNhFORePeJJKyNTBv9kN+lQKihS6x5d1PtaEAFj5iVZsNAk5uJcTxg4/UJLTC7SPk77WSvxTRnGQDPGSjzgWP7QSBO+P0vtYhIKQQe0/lzaL00r","brk":[146,207]}],"ligs":[{"el":"C C C O O O C C C C C C C C C N N O C C C C C C C C C","xyz":"p/9ZACX8hP89AFT8YP9fAFf8/f73/3f8LP/q/8f8W/9ZAKr8fv+UAA38c/+eACX8jv9+AA38ef+RAD38SP8QAMr8U/8nAL78G/8bAHP8c/8/AIv8kP9tAFf8fv9WAHz8IP/2/5L8Nf8hAHv8Ef8BAH/8lP9xACX8N/8AALv8iv97AD38Tf8tAKP8Mf8GAKH8PP8cAJX8WP9FAJf8ff9YAF/8","b":"AAATAAEAGgACABoAAwASAAQAFAAFABkABgAHAAYACAAHAAkACAATAAkAFQAKAAsACgAUAAsAFgAMABEADAASAA0ADwANABkADgAVAA4AGgAPABoAEAASABAAFwARABgAEwAVABQAFwAWABgAFgAZABcAGAA=","name":"P0G","chain":"R","seq":366}],"res":[]}});
Object.assign(BIO_MOL, {"cortisol":{"name":"Cortisol","el":"C C C C C O C C C C C C C O C C C C C C C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"AP/D/0n/A//f/+D/vf5u/ywAJv5n/xUA5P3w/yUAbf34/0EAOP5tABAAuv5mAPH/Bf/qAN7/l//lAAgA3v9jAN3/kv/q/xcA3/9p/ycA2f8J/7//dgB4/0wAugDn/wAAwQDL/2r/agBqABgAxQDYAOT/VQGiAPv/RgESADAASwEZAL4AswG1////qAE7/xEAMQLk/7b/gAI1AA0AZv+6/yT/z/4WABb/yv5n/zb/5/4N/xAAzv59/5cA+v0h/1wAE/5C/7D/Cv7QABwA0v43ARgA//4GAXT/zf85Adz/nv/sAHUA4P9eAHH/gP8LAIIAs/82/4EAqf+6/t7/pgAY/zYAeQCI/7gA+QBv/1n/8wAdADX/XQC//0H/YAB2AIUAtgDnAHn/uAA0ARsAhgHfAEUAiQGlAJz/JwFuANsAbAKM/5r/FwIbAFz/RgJgAE4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADAAOAA4ADwAPABAADwARAAoAEQARABIAEgATABMAFAAPABQAFAAVABQAFgAWABcAFgAYABgAGQAAABoAAAAbAAAAHAACAB0AAgAeAAMAHwADACAABgAhAAgAIgAIACMACQAkAAkAJQAKACYACwAnAAwAKAANACkADgAqAA4AKwAQACwAEAAtABAALgARAC8AEgAwABIAMQATADIAEwAzABUANAAYADUAGAA2ABkANwA=","o":"11112121111111111111111111211111111111111111111111111111111"},"testosterone":{"name":"Testosterone","el":"C C C C C C C C C C C O C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"7v5NAG3/7/46AAQAOv+rAEgAzf+tABkAFAAnACUAwv+v//H/BgAs/yEAkQAg/+L/5ACg//D/aAGS/wMAwwELABMAOwL9/yQAhQGXAAwA8gCUADYAoQAqAOn/nQBVAFb/Nv+0/ykA0v5L//r/SP6L/xUAYf4fADcAAf5wAPj/U/9QAEb/vv6tAFT/tv78/z7/DP8LAS8AOP+eALUAz//RALP/AAD3AFkAIgAUAJIAwv+t/4X/DgAv/40AyP/Y/gMAhgAI/3j/xgDO/hMAkgEt/wgAvAHaAE8AjQG9AKb/6wCAAKAAyAD3ACAA/wBDACn/UgAcACD/hgC/AFD/Ov+x/5cA3P7w/jQA3f44/5D/C/6E/7z/Gf5a/2oAXv4sAKMAqP1NAAcA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwAKAAwADAANAA0ADgAEAA4ACAAOAA4ADwAFABAAAQAQABAAEQARABIAEgATAAEAEwATABQAAAAVAAAAFgAAABcAAgAYAAIAGQADABoAAwAbAAQAHAAFAB0ABgAeAAYAHwAHACAABwAhAAkAIgAMACMADAAkAA0AJQANACYADwAnAA8AKAAPACkAEAAqABEAKwARACwAEgAtABIALgATAC8AFAAwAA==","o":"1111111121211111111111111111111111111111111111111111"},"pro":{"name":"Proline","el":"O C O C C C C N H H H H H H H H H","xyz":"+P4CAC8Aef8BAPP/g//9/3n/9v8DAEoATAB9ACUAygBGAOL/ugCu/+H/RgCM/zIA9f4gAIsA2v8IALMAZgC0AH8AFQC9AOD/IgFiABwA0QBsAH3/rACL/3v/FAGA/wwADgBH/wEA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAMABwAAAAgAAwAJAAQACgAEAAsABQAMAAUADQAGAA4ABgAPAAcAEAA=","o":"12111111111111111"},"dopamine":{"name":"Dopamine","el":"N C C C C C C O C O C H H H H H H H H H H H","xyz":"yv4LAIsAz/5CAAQAGf/h/6j/rf/d/83/6f9o/+f/dwBk/woAvgDW/xEARwHT/zMAfABXAPX/xgDPAPz/+v9aANX/df4qALkAGf8rAMAABf+hAAYAav5TAN//7v59/7T/Dv8BAEH/sP8L/+H/qAAF/x8AbwF6/z0AxwD8AFIAyf+5AMD/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAIAAkACAAKAAMACgAAAAsAAAAMAAEADQABAA4AAgAPAAIAEAAEABEABQASAAcAEwAJABQACgAVAA==","o":"1112121112111111111111"},"trh":{"name":"Thyrotropin-releasing hormone (TRH)","el":"N C O C C C C N C O C C C C N C N N C O C C C C O N H H H H H H H H H H H H H H H H H H H H H H","xyz":"ev5ZAd3/3v4EAR0AQf82AU8Ayf5tACMAm/5FAK8AEv/8/+8Af//5/4QAR/8pAAgAe/8dAIL/OP9PACb//P/Z/1X/4v9G/zP/s//5/qv///+1/v//qv9+/l4AKf+l/j0ALf/u/tP/agDl/7T/rwBkAMf/igDFAIX/IgF0ACkAkwHHAOv/FQKCABUA6gH4/0cANgKe/2AAWwH0/1EAJ/4wAbP/iP69Adn/fv5PANr/Rf4DAKkAg/6eAOkANf8yAEYB9f6X/woBpP+T/3oA0f85AKQAHAAKAPf+mP9B/+P+QAAb/wz/aQCp/vv/xf9F/qsA0P6M/nMAhQCT/+j//gCoAIIAkQEsARIAjAHHAH//RAK6AGUAVwJ5AMD/JQGm/28A","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAMABwAHAAgACAAJAAgACgAKAAsACwAMAAwADQANAA4ADgAPAA8AEAAMABAACgARABEAEgASABMAEgAUABQAFQAVABYAFgAXABcAGAAXABkAFAAZAAAAGgAAABsAAwAcAAQAHQAEAB4ABQAfAAUAIAAGACEABgAiAAoAIwALACQACwAlAA0AJgAOACcADwAoABEAKQAUACoAFQArABUALAAWAC0AFgAuABkALwA=","o":"12111111121112112111211112111111111111111111111111"},"oxytocin":{"name":"Oxytocin","el":"C C C C C C O N C C C C N O C O N C C C N O C O N C C S S C C N C O N C C C C C C O C C C O N C O N C C C C C O N C C C C C C O N C C N O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"VP/S/osBuf9B/3EBQAD9/m4BnQAz/9cBcQD9/t4AugB7/7MAGwFv/2kAkQAAAN4AyQCCAL8AfgDtABABugAGAZkBrQCPAPcBJAFVADQCPwBfAA8CXwGXAMUApgFVABABoQH7AHAAXAFRARQAjwHgAS4AEgE2AiIAzABkApoA5wBWArT/ZQEsAYH/xAFIATv/8wDjAEb/7wC6ALv+VAFKAKP+UwHj/zj/kQCn/1D/YwA6/8v+4AD4/pL+rQCZ/jH+OgGy/vX+sQGm/s3+JAF6/nj/rgBy/sv/TQAV/oT/v/8z/q//iv+t/rz//v6//ub/sf5V/gAAKv5n/ikA6f7O/fL/aP++/cz/1AA6/lQADwHO/V4AtgB//tEAZACaAIf+YgBXAB7+4/++ALr+ZP+XAHn+Cv8UAYb+Tv9rAfD+tv8KAS7/eP+yAJj/yv9xAN3/8P6XAMH/bv7CAJn/Mv5SAEX/sP2QABL/PP1BAE3/s/2MAHr+GP7UABkA7/1EATQA+/1iAG0Aqv1uAOYABf6QAF0BEv4yAMwBQv76AF8BZ/9+/kcB7/73/noBXf+w/vIBtf+K/8IBo/9z/xMBLQCS/okBZABd/ysC2wDi/v8B4ACA/7EBFwD2/p0AQAAEABwBrACUAFUAfgBLAdgAFQDPABsBhABbAccBIgElAZIBfwF9ACACHAEGAHICBgIDAXoA8ABUASwAtAHlAZUA2wEAAur/7wBKAvUAeQCdApIApgDOAIT/FAERAYD+uAF6AJ7+SwEPAEv+LQBu/3v+IQDq/vD+GgFE/1z+WgBr/lT+mADI/tr9ewFR/qD/hQDU/tz/VwAi/hj/ZQCt/Zz/xP8H/6j/1f4k/+//Bf6//hsAq/53/QgAkv9a/cL/1QBP/iYBOP9FALH+a/+AABD+pv72AKH+Cv9IASb+Dv+UATr/hv+7Ab3+BgBIAVb/7f5SABEAbP4gAWT/c/44APP+Hf76/4L/p/34ADL/VP3W/0z/K/1gALT/4vxRABL/TP2KAFP+5/0yAFf+5f3kAFP+H/4GAFQAef0PAPoAX/28ANoA3/3b/8oBTf5IABsC","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwACwANAAgADgAOAA8ADgAQABAAEQARABIAEgATABMAFAATABUAEQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB4AIAAgACEAIAAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQAoACoAKgArACUAKwAjACwALAAtACwALgAEAC4AGQAvAC8AMAAvADEAMQAyADIAMwAzADQANAA1ADEANQA1ADYANgA3ADYAOAA4ADkAOQA6ADoAOwA7ADwAOwA9ADkAPgA+AD8APgBAAEAAQQBBAEIAQgBDAEIARAAAAEUAAABGAAAARwABAEgAAQBJAAIASgADAEsAAwBMAAMATQAEAE4ABwBPAAgAUAAJAFEACQBSAAoAUwAKAFQADABVAAwAVgAQAFcAEQBYABIAWQASAFoAFABbABQAXAAYAF0AGQBeABoAXwAaAGAAHQBhAB0AYgAeAGMAHwBkAB8AZQAiAGYAIwBnACQAaAAkAGkAJgBqACcAawApAGwAKgBtACsAbgAuAG8AMgBwADIAcQAzAHIAMwBzADQAdAA0AHUANQB2ADgAdwA5AHgAOgB5ADoAegA7AHsAPAB8ADwAfQA8AH4APQB/AD0AgAA9AIEAQACCAEEAgwBBAIQAQwCFAEMAhgA=","o":"11111211111121211111212111111111211112121121121112111111121111111211112111111111111111111111111111111111111111111111111111111111111111111"},"vasopressin":{"name":"Vasopressin","el":"N C O C C C N C O C C C C C C C C N C O C C C C C C O C C N C O C N C S S C C C O N C C C C C O N C C C C N C N N C O N C C N O N C O C C C N O N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"3P3I/aIAU/7Q/fYAi/5q/RoBif5Z/iABE/9w/ucAF//I/mwAyf5B/3QAPv5Z/08A+v3//iAA/P3j/2AAk/0BAPb/z/0pAHD/E/7V/yH/Sf4EAKD+N/6DAHn+7P3gAM/+u/21AET/X/5MAGcASv7QAKQA4P3vANYAw/4uAaEA7P5RATABSf/iAF4BGv9nAHkBc//7/6UB9/8SALMBTgCq/90BLACYAJUB2f/6AG0Bqv6lAVYABv/4AQgAz/5bAtL/mv/pAe//3v+XAVAAxv+7AWX/OP91AQ7//P7QAHX/i/9yAKv/2/9ZACz/awA/AFT/iAAUAMP/1ABbAPX+uwCOAG/+PQGAAB/+pwFQAIL+YwFIAAv/lwG5AGP/ZwEpAU//+gGwAMz/QwI9APz/4wHN/x4A7gG2/7QAgQEIAPoAowGVAP4A/AHLAGQBNwJ1AMkBFwJKAWQBrAIIAJv/tQI4ACr/CQOd/73/CgNc/0AAfgP5/kYAZANu/m0A7wMd/ysAn//1/9j+jP9n/+r+U/8v/4v+tP8S/2L/RADg/lP/VgCC/tz+dQC2/lj+TQAI/uv+Wv+g/nL/EP97/ur/y/4W/t3/rf0c/oQAuP1t/YcAkv5Y/o8BQP6l/ggBU/+e/jUBQv8P/s8Agv/v/m4A//6P/5wAyP3g/8IATP2w/+n/WP1YABoAJP5u/z3/gf7A/2D+X/6lABr+3f1HAbD+g/35AIT/vP49AEAAF//2AHQAlP5XAXABIP+xATABr/5SAG8BS/+Y/7sBJQBT/+kBlgCsAKABAwBcAVgBSP7HAVYAxf9QAvv/2f/FAaoAQACNATgAFABwAW7/7f8QAi3/wv+rAPX/a/8TANb/3v+3APH+bQBUAD/+ngD3AHT+WgHhAPb9MAE3AM/9ywHt/2X++QGXAIb+dgHm/zb/DwIJAfz/eQJeAFYAfQHs/wYA/AFz/+f/2AFL/8gATwLK/90AdAHi/2ABIwH7/8UAewHUALkAdQKcAA8CIwISAMoB7gGGAR4BTAN//3f/rAIm/04AFQOn/44AsAMs/nIABgNR/oMAfP8ZAH3+r/9Q/7z/hgA2/0P/YQCt/q//fgAa/0r+ggB3/gr+S/9i/iL/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAAsAEAAJABEAEQASABIAEwASABQAFAAVABUAFgAWABcAFwAYABgAGQAZABoAGQAbABsAHAAWABwAFAAdAB0AHgAeAB8AHgAgACAAIQAgACIAIgAjACMAJAAkACUAJQAmACYAJwAnACgAJwApACkAKgAqACsAKwAsACwALQApAC0ALQAuAC4ALwAuADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADYAOAAxADkAOQA6ADkAOwA7ADwAPAA9AD0APgA9AD8AJgBAAEAAQQBBAEIAQQBDAEMARABEAEUARQBGAEUARwBDAEgASABJAAUASQBJAEoAAABLAAAATAADAE0AAwBOAAQATwAEAFAABQBRAAYAUgAJAFMACgBUAAoAVQAMAFYADQBXAA4AWAAPAFkAEABaABEAWwAUAFwAFQBdABUAXgAXAF8AGABgABoAYQAbAGIAHABjAB0AZAAgAGUAIQBmACEAZwAiAGgAIgBpACUAagAlAGsAJgBsACoAbQAqAG4AKwBvACsAcAAsAHEALAByAC0AcwAwAHQAMQB1ADIAdgAyAHcAMwB4ADMAeQA0AHoANAB7ADUAfAA3AH0ANwB+ADgAfwA7AIAAPACBADwAggA+AIMAPgCEAEAAhQBDAIYARACHAEQAiABGAIkARgCKAEgAiwA=","o":"12111112111212121112111212112111211111111211111112111111112121111211211112111211111111111111111111111111111111111111111111111111111111111111111"}});


// @scene pituitary makePituitary | Гипоталамус и гипофиз | Гормоны
/* =========================================================
   БИОХИМИЯ · ГИПОТАЛАМУС И ГИПОФИЗ: либерины и статины, портальная система, гормоны передней доли
   (СТГ, пролактин, АКТГ/ПОМК, ТТГ, ЛГ/ФСГ), задняя доля (вазопрессин, окситоцин);
   вазопрессин и вода (рецептор V2, аквапорин-2, несахарный диабет, СНСАДГ); гормон роста и рост тела
   ========================================================= */
function makePituitary() {
  __set_rnd(mulberry(8501));
  const scene = bioStage({ rim: 0x9f7bff });
  const VIEW = { map: [V3(-0.3, -0.7, 0), V3(0.2, 0.3, 17)], water: [V3(39.4, -0.9, 0), V3(39.9, -0.1, 21)], growth: [V3(79.0, 0.4, 0), V3(79.6, 1.6, 27)] };
  const VIEWM = { map: [V3(0.7, -0.4, 0), V3(1.1, 0.4, 17)], water: [V3(40, -0.5, 0), V3(40.4, 0.3, 25)], growth: [V3(80, 0.4, 0), V3(80.6, 1.6, 27)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.map[1]);
  const controls = makeControls(camera, VIEW.map[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ball = (r, col, parent) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true })); s.visible = false; parent.add(s); return s; };

  /* ---------- 1. гипоталамус и гипофиз (сагиттальный вид; вперёд — вправо) ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const hyp = new THREE.Mesh(blobGeo(1.75, 0.85, 1.05, 4, 0.06), glassMat('#C8B8FF', { rim: 0.75, base: 0.04, keep: true })); hyp.position.set(0, 2.35, 0); G1.add(hyp);
  const SON = V3(0.95, 1.8, 0.35), PVN = V3(-0.25, 2.7, 0.35), ARC = V3(0.25, 1.72, 0.45), ME = V3(0.2, 1.25, 0.05);
  const sonG = glowNucleus(G1, SON, '#7FD6FF', 0.07, 8), pvnG = glowNucleus(G1, PVN, '#7FE0A0', 0.07, 8), arcG = glowNucleus(G1, ARC, '#F2C14E', 0.07, 8);
  const translucent = (col, op) => organMat(col, 0.55, { transparent: true, opacity: op, depthWrite: false, emissiveIntensity: 0.06 });
  const stalkC = new THREE.CatmullRomCurve3([V3(0.18, 1.45, 0), V3(0.12, 0.65, 0), V3(0.0, -0.1, 0)]);
  G1.add(new THREE.Mesh(taperTube(stalkC, (u) => 0.24 - 0.08 * u, 30, 14), translucent('#E8C0D0', 0.55)));
  const P_ANT = V3(0.8, -0.82, 0), P_POST = V3(-0.58, -0.88, 0);
  const ant = new THREE.Mesh(blobGeo(0.98, 0.7, 0.72, 7, 0.07), translucent('#E890A0', 0.32)); ant.position.copy(P_ANT); G1.add(ant);
  const post = new THREE.Mesh(blobGeo(0.6, 0.55, 0.55, 9, 0.07), translucent('#D8C8F0', 0.4)); post.position.copy(P_POST); G1.add(post);
  // турецкое седло — задняя нижняя четверть «чаши»
  const sella = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, Math.PI, Math.PI, Math.PI / 2, Math.PI / 2), organMat('#E8DCC0', 0.45, { side: THREE.DoubleSide, emissiveIntensity: 0.03 }));
  sella.scale.set(1.95, 1.15, 1.25); sella.position.set(0.1, -0.55, 0); G1.add(sella);
  // перекрёст зрительных нервов
  const nerveM = organMat('#E8E0C8', 0.6, { emissiveIntensity: 0.05 });
  [0.55, -0.55].forEach((a) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.7, 12), nerveM); c.rotation.set(Math.PI / 2, 0, a); c.position.set(1.15, 1.32, 0); G1.add(c); });
  // сосуды: первичная сеть в срединном возвышении → портальные вены → вторичная сеть в передней доле → в кровь
  const artM = organMat('#D84A50', 0.6, { emissiveIntensity: 0.1 }), veinM = organMat('#6A70D8', 0.6, { emissiveIntensity: 0.1 });
  for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const pts = []; for (let j = 0; j <= 12; j++) { const u = j / 12 * Math.PI * 2; pts.push(ME.clone().add(V3(Math.cos(a) * 0.18 + Math.cos(u) * 0.1, Math.sin(u) * 0.12, Math.sin(a) * 0.18 + Math.sin(u) * 0.06))); } G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 30, 0.018, 6, true), artM)); }
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(1.6, 1.0, -0.3), V3(0.9, 1.15, -0.1), ME.clone()]), 30, 0.03, 8), artM));
  const PORT = [[0.15, 0.18], [-0.12, 0.05]].map(([dz, dx]) => new THREE.CatmullRomCurve3([ME.clone().add(V3(dx, -0.05, dz)), V3(0.42 + dx, 0.3, dz), V3(0.62 + dx, -0.3, dz * 0.8), V3(0.8 + dx, -0.7, dz * 0.5)]));
  PORT.forEach((c) => G1.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.03, 8), artM)));
  for (let k = 0; k < 4; k++) { const pts = []; for (let j = 0; j <= 10; j++) pts.push(P_ANT.clone().add(V3(-0.55 + j * 0.11, -0.3 + 0.2 * Math.sin(j * 1.3 + k * 2) + k * 0.15, 0.25 * Math.cos(j + k)))); G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.016, 6), artM)); }
  const pAntOut = new THREE.CatmullRomCurve3([P_ANT.clone().add(V3(0.1, -0.1, 0.12)), V3(1.05, -1.45, 0.05), V3(1.7, -2.15, 0), V3(2.45, -2.6, 0)]);
  const pPostOut = new THREE.CatmullRomCurve3([P_POST.clone().add(V3(-0.05, -0.15, 0.08)), V3(-0.75, -1.45, 0.02), V3(-1.35, -2.15, 0), V3(-2.1, -2.6, 0)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(pAntOut, 40, 0.045, 8), veinM), new THREE.Mesh(new THREE.TubeGeometry(pPostOut, 40, 0.045, 8), veinM));
  // аксоны крупноклеточных нейронов (SON, PVN) → задняя доля; мелкоклеточных (ARC) → срединное возвышение
  const axSON = new THREE.CatmullRomCurve3([SON.clone(), V3(0.55, 1.45, 0.2), V3(0.2, 0.9, 0.08), V3(0.06, 0.2, 0.05), V3(-0.3, -0.55, 0.08), P_POST.clone().add(V3(0.05, -0.05, 0.12))]);
  const axPVN = new THREE.CatmullRomCurve3([PVN.clone(), V3(-0.05, 2.1, 0.25), V3(0.15, 1.35, 0.0), V3(0.08, 0.5, -0.05), V3(-0.2, -0.3, -0.05), P_POST.clone().add(V3(-0.1, 0.05, -0.08))]);
  const axARC = new THREE.CatmullRomCurve3([ARC.clone(), V3(0.24, 1.48, 0.25), ME.clone().add(V3(0.02, 0.06, 0.1))]);
  const axMat = (col) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(0.4), emissive: col, emissiveIntensity: 0.25, roughness: 0.4 });
  const axM = [[axSON, '#7FD6FF'], [axPVN, '#7FE0A0'], [axARC, '#F2C14E']].map(([c, col]) => { const m = new THREE.Mesh(new THREE.TubeGeometry(c, 60, 0.022, 6), axMat(col)); G1.add(m); return m; });
  // клетки передней доли: пять типов
  const TYPES = [
    { id: 'gh', col: '#7FE0A0', n: 34 }, { id: 'prl', col: '#FF8AB0', n: 11 }, { id: 'acth', col: '#F2C14E', n: 11 }, { id: 'tsh', col: '#7FD6FF', n: 5 }, { id: 'gn', col: '#C77DFF', n: 8 },
  ];
  const dmy = new THREE.Object3D();
  TYPES.forEach((T) => {
    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(T.col).multiplyScalar(0.45), emissive: T.col, emissiveIntensity: 0.1, roughness: 0.45 });
    const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 1), mat, T.n); T.mat = mat; T.pos = [];
    for (let i = 0; i < T.n; i++) { let p; do { p = V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)); } while (p.length() > 1); p.multiply(V3(0.82, 0.55, 0.58)).add(P_ANT); T.pos.push(p); dmy.position.copy(p); dmy.scale.setScalar(rand(0.8, 1.2)); dmy.updateMatrix(); im.setMatrixAt(i, dmy.matrix); }
    G1.add(im);
  });
  // окончания аксонов в задней доле (тельца Херринга)
  const herr = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x506080, emissive: 0x9fb4ff, emissiveIntensity: 0.2, roughness: 0.4 }), 18);
  for (let i = 0; i < 18; i++) { const p = V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(rand(0.1, 0.42)).add(P_POST); dmy.position.copy(p); dmy.scale.setScalar(1); dmy.updateMatrix(); herr.setMatrixAt(i, dmy.matrix); }
  G1.add(herr);
  // ПОМК → фрагменты
  const pomc = new THREE.Group(); pomc.position.set(2.35, -0.25, 0.2); G1.add(pomc);
  const POMC = [['γ-MSH', '#9FB4FF', 0.38], ['ACTH', '#F2C14E', 0.52], ['γ-LPH', '#FF9A5C', 0.32], ['β-endorphin', '#FF6FA8', 0.4]];
  let px = 0; const pomcSeg = POMC.map(([, col, w]) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, w - 0.15, 4, 10), protMat(col, 0.55, { emissiveIntensity: 0.15 })); m.rotation.z = Math.PI / 2; m.userData.x0 = px + w / 2; px += w; pomc.add(m); return m; });
  pomcSeg.forEach((m) => { m.userData.x0 -= px / 2; m.position.x = m.userData.x0; });
  // молекулы-регуляторы справа
  const MOLS = { tsh: fit('trh', 0.65), prl: fit('dopamine', 0.6), adh: fit('vasopressin', 0.9), oxt: fit('oxytocin', 0.9) };
  Object.values(MOLS).forEach((m) => { m.position.set(2.75, 0.75, 0.2); m.visible = false; G1.add(m); });
  // частицы
  const P1 = Array.from({ length: 70 }, () => ({ s: ball(0.042, '#ffffff', G1), on: false, t: 0, path: null, next: null, col: '#fff', sp: 0.3 }));
  const launch1 = (path, col, sp, next) => { const p = P1.find((x) => !x.on); if (!p) return; Object.assign(p, { on: true, t: 0, path, col, sp, next }); p.s.material.color.set(col); p.s.visible = true; };
  const HORM = {
    gh: { rel: '#7FE0A0', out: '#7FE0A0', nuc: 'arc' }, prl: { rel: '#FF5A5A', out: '#FF8AB0', nuc: 'arc' }, acth: { rel: '#F2C14E', out: '#F2C14E', nuc: 'pvnp' },
    tsh: { rel: '#7FD6FF', out: '#7FD6FF', nuc: 'pvnp' }, gn: { rel: '#C77DFF', out: '#C77DFF', nuc: 'arc' }, adh: { out: '#5B8CFF', nuc: 'son' }, oxt: { out: '#FF9AE0', nuc: 'pvn' },
  };
  const axPVNp = new THREE.CatmullRomCurve3([PVN.clone(), V3(0.0, 1.9, 0.3), ME.clone().add(V3(-0.02, 0.06, 0.1))]);
  const axPm = new THREE.Mesh(new THREE.TubeGeometry(axPVNp, 40, 0.016, 6), axMat('#7FE0A0')); G1.add(axPm);
  const relPath = PORT.map((pc) => new THREE.CatmullRomCurve3([...axARC.getPoints(6), ...pc.getPoints(8).slice(1)]));
  const relPathP = PORT.map((pc) => new THREE.CatmullRomCurve3([...axPVNp.getPoints(6), ...pc.getPoints(8).slice(1)]));

  /* ---------- 2. вазопрессин и вода: клетка собирательной трубки ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const AY = 1.25, BY = -1.25;   // апикальная (к моче) и базолатеральная (к крови) мембраны
  const memA = schemBilayer({ w: 7.2, d: 2.4, thick: 0.34, step: 0.16, head: '#E8C07A', tail: '#B8A27A', seed: 21 }); memA.position.y = AY; G2.add(memA);
  const memB = schemBilayer({ w: 7.2, d: 2.4, thick: 0.34, step: 0.16, head: '#E8C07A', tail: '#B8A27A', seed: 22 }); memB.position.y = BY; G2.add(memB);
  __set_rnd(mulberry(8502));
  const cyto = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.2, 0.02), new THREE.MeshBasicMaterial({ color: 0x3a2018, transparent: true, opacity: 0.35, depthWrite: false })); cyto.position.z = -1.2; G2.add(cyto);
  const lumen = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.3, 2.4), new THREE.MeshPhysicalMaterial({ color: 0x5a4a10, emissive: 0xf2d27a, emissiveIntensity: 0.05, transparent: true, opacity: 0.1, depthWrite: false, roughness: 0.2 })); lumen.position.y = AY + 0.85; G2.add(lumen);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 7.2, 24, 1, true), organMat('#D84A50', 0.5, { transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false })); cap.rotation.z = Math.PI / 2; cap.position.set(0, BY - 1.05, -0.2); G2.add(cap);
  const nuc2 = new THREE.Mesh(new THREE.SphereGeometry(0.62, 30, 20), glassMat('#9F7BFF', { rim: 0.8, base: 0.05, keep: true })); nuc2.position.set(2.6, -0.15, -0.6); nuc2.scale.setScalar(0.8); G2.add(nuc2);
  // рецептор V2 (структура GPCR + Gs; на примере β2-адренорецептора, PDB 3SN6) в базолатеральной мембране
  const gs = 0.022, GP = new THREE.Group(); G2.add(GP);
  const recM = proteinMesh('gpcr', { scale: gs, chains: ['R'], colorBy: () => '#FF8A5C' }), gaM = proteinMesh('gpcr', { scale: gs, chains: ['A', 'B', 'G'], colorBy: () => '#8FB8A8' });
  GP.add(recM, gaM); recM.children.forEach((m) => { if (m.material) m.material.emissive = new THREE.Color('#FF8A5C'); });
  { const cen = (ch) => { const pts = caPoints('gpcr', gs, ch); return pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length); };
    const rc = cen(['R']), gc = cen(['A', 'B', 'G']); GP.quaternion.setFromUnitVectors(rc.clone().sub(gc).normalize(), V3(0, -1, 0));
    const r2 = rc.clone().applyQuaternion(GP.quaternion); GP.position.set(-2.4 - r2.x, BY - r2.y - 0.05, 0.2 - r2.z); }
  const avp = fit('vasopressin', 0.42); G2.add(avp);
  const pka2 = new THREE.Mesh(blobGeo(0.32, 0.26, 0.26, 23, 0.12, 3), protMat('#C77DFF', 0.45)); pka2.position.set(-0.9, -0.05, 0.3); G2.add(pka2);
  // аквапорины: AQP2 (в пузырьках / в апикальной мембране), AQP3/4 — всегда в базолатеральной
  const aqMat = protMat('#7FD6FF', 0.55, { emissiveIntensity: 0.15 }), aq34Mat = protMat('#7FE0A0', 0.5, { emissiveIntensity: 0.1 });
  const aqGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.42, 12);
  const NAQ = 10, AQ = Array.from({ length: NAQ }, (_, i) => {
    const m = new THREE.Mesh(aqGeo, aqMat); const home = V3(-1.7 + (i % 5) * 0.62 + rand(-0.1, 0.1), -0.45 + Math.floor(i / 5) * 0.45 + rand(-0.08, 0.08), rand(-0.6, 0.7));
    const ves = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0x705a40, emissive: 0xffd0a0, emissiveIntensity: 0.06, transparent: true, opacity: 0.35, depthWrite: false })); ves.position.copy(home);
    const slot = V3(-2.2 + i * 0.5, AY, rand(-0.7, 0.7)); m.position.copy(home); G2.add(m, ves); return { m, ves, home, slot, k: 0 };
  });
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(aqGeo, aq34Mat); m.position.set(-1.5 + i * 0.75, BY, rand(-0.7, 0.7)); G2.add(m); }
  const camp2 = Array.from({ length: 14 }, () => ({ s: ball(0.05, '#F2C14E', G2), on: false, t: 0, a: V3(0, 0, 0) }));
  const W = Array.from({ length: 60 }, () => ({ s: ball(0.045, '#5BA8FF', G2), on: false, t: 0, path: null, sp: 0.4 }));
  const U = Array.from({ length: 30 }, () => ({ s: ball(0.04, '#F2D27A', G2), on: false, t: 0, z: 0, y: 0 }));

  /* ---------- 3. гормон роста и рост тела ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const FOOT = -2.4, BODYH = 7.05;   // высота силуэта (≈ 178 см)
  const BG = new THREE.Group(); BG.position.y = FOOT; G3.add(BG);
  const IN = new THREE.Group(); IN.position.y = -FOOT; BG.add(IN);
  bodyShell(IN, { rim: 0.16, keep: true });
  const PIT3 = V3(0, 4.12, 0.12), LIV3 = V3(-0.35, 1.5, 0.18);
  const pitG3 = glowNucleus(IN, PIT3, '#9F7BFF', 0.05, 9);
  const liv3 = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV3), organMat('#9A4A3A', 0.5)); IN.add(liv3);
  const PLATES = [V3(0.48, -1.2, 0.03), V3(-0.48, -1.2, 0.03), V3(1.4, 1.35, 0.0), V3(-1.4, 1.35, 0.0)];
  const plateM = PLATES.map((p) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.035, 20), new THREE.MeshBasicMaterial({ color: '#7FE0A0', transparent: true, opacity: 0.8 })); m.position.copy(p); IN.add(m); return m; });
  const HANDS = [V3(1.47, 0.92, 0.05), V3(-1.47, 0.92, 0.05)].map((p) => { const m = new THREE.Mesh(blobGeo(0.12, 0.19, 0.07, 31, 0.1, 3), organMat('#E2B0A0', 0.5, { emissiveIntensity: 0.06 })); m.position.copy(p); IN.add(m); return m; });
  const jaw = new THREE.Mesh(blobGeo(0.2, 0.09, 0.14, 33, 0.08, 3), organMat('#E2B0A0', 0.5, { emissiveIntensity: 0.06 })); jaw.position.set(0, 3.82, 0.16); IN.add(jaw);
  const A3 = {
    gh: flowArrow(IN, PIT3.clone().add(V3(-0.04, -0.06, 0.05)), LIV3.clone().add(V3(0.08, 0.2, 0.15)), '#9F7BFF', { bend: 0.25, r: 0.022 }),
    k1: flowArrow(IN, LIV3.clone().add(V3(0.1, -0.15, 0.15)), PLATES[0].clone().add(V3(0, 0.1, 0.1)), '#7FE0A0', { bend: -0.15, r: 0.02 }),
    k2: flowArrow(IN, LIV3.clone().add(V3(-0.05, -0.15, 0.15)), PLATES[1].clone().add(V3(0, 0.1, 0.1)), '#7FE0A0', { bend: 0.15, r: 0.02 }),
    h1: flowArrow(IN, LIV3.clone().add(V3(0.2, 0.05, 0.15)), PLATES[2].clone().add(V3(-0.05, 0.05, 0.05)), '#7FE0A0', { bend: 0.15, r: 0.02 }),
    h2: flowArrow(IN, LIV3.clone().add(V3(-0.3, 0.05, 0.15)), PLATES[3].clone().add(V3(0.05, 0.05, 0.05)), '#7FE0A0', { bend: -0.15, r: 0.02 }),
  };
  const tumor = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: '#FF5A5A', transparent: true, opacity: 0.85 })); tumor.position.copy(PIT3).add(V3(0.04, -0.02, 0.06)); IN.add(tumor);
  // линейка
  const CM = BODYH / 178;
  const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.03, 225 * CM, 0.03), new THREE.MeshBasicMaterial({ color: '#8A90A8' })); ruler.position.set(-2.3, FOOT + 112.5 * CM, 0); G3.add(ruler);
  [50, 100, 150, 200].forEach((v) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.03), new THREE.MeshBasicMaterial({ color: '#C8CCE0' })); t.position.set(-2.3, FOOT + v * CM, 0); G3.add(t); });
  const floor = new THREE.Mesh(new THREE.RingGeometry(0.2, 2.2, 48), new THREE.MeshBasicMaterial({ color: '#3A3F58', transparent: true, opacity: 0.35, side: THREE.DoubleSide })); floor.rotation.x = -Math.PI / 2; floor.position.y = FOOT; G3.add(floor);
  // рост по возрасту: медиана (мужчины, см)
  const MED = [[0, 50], [1, 76], [2, 88], [4, 103], [6, 116], [8, 128], [10, 138], [12, 149], [14, 164], [16, 174], [18, 177], [20, 178], [25, 178]];
  const med = (a) => { for (let i = 1; i < MED.length; i++) if (a <= MED[i][0]) { const [a0, h0] = MED[i - 1], [a1, h1] = MED[i]; return h0 + (h1 - h0) * (a - a0) / (a1 - a0); } return 178; };
  const AMAX = 25;

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'map', labels: true, rot: false, fly: null, msg: null, sel: 'all', relT: 0,
    dis: 'norm', treat: false, tbw: 42, adh: 1, posm: 287, urine: 1.4, uosm: 500, intake: 1.5, day: 0, hist: [],
    gdis: 'norm', gtreat: false, age: 0, hold: 0, curve: [], igf: 100, hgt: 50, acro: 1 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['map', 'water', 'growth'][k] === m; }); st.fly = flyTarget(VV(m)[0], VV(m)[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  function mapUpdate(dt, t) {
    const sel = st.sel, all = sel === 'all';
    const on = (k) => all || sel === k;
    TYPES.forEach((T) => { const o = on(T.id); T.mat.emissiveIntensity = o ? 0.25 + 0.2 * Math.sin(t * 4 + T.n) : 0.0; T.mat.color.set(T.col).multiplyScalar(o ? 0.45 : 0.07); });
    axM[0].material.emissiveIntensity = on('adh') || (sel === 'oxt') ? 0.4 : 0.06; axM[1].material.emissiveIntensity = on('oxt') || sel === 'adh' ? 0.4 : 0.06;
    axM[2].material.emissiveIntensity = all || ['gh', 'prl', 'gn'].includes(sel) ? 0.4 : 0.06; axPm.material.emissiveIntensity = all || ['tsh', 'acth'].includes(sel) ? 0.4 : 0.06;
    sonG.spr.material.opacity = on('adh') || sel === 'oxt' ? 0.7 : 0.15; pvnG.spr.material.opacity = on('oxt') || ['adh', 'tsh', 'acth'].includes(sel) ? 0.7 : 0.15; arcG.spr.material.opacity = axM[2].material.emissiveIntensity > 0.1 ? 0.7 : 0.15;
    // выпуск частиц
    const keys = all ? Object.keys(HORM) : [sel];
    keys.forEach((k) => {
      const H = HORM[k], rate = (all ? 0.9 : 2.6) * (k === 'gn' ? (Math.sin(t * 1.4) > 0.6 ? 3 : 0.1) : 1);   // ГнРГ — импульсами
      if (rnd() > dt * rate) return;
      if (H.nuc === 'arc') launch1(relPath[(rnd() * 2) | 0], H.rel, 0.33, k);
      else if (H.nuc === 'pvnp') launch1(relPathP[(rnd() * 2) | 0], H.rel, 0.33, k);
      else { const ax = k === 'adh' ? (rnd() < 0.75 ? axSON : axPVN) : (rnd() < 0.75 ? axPVN : axSON); launch1(ax, H.out, 0.22, 'post'); }
    });
    P1.forEach((p) => {
      if (!p.on) return; p.t += dt * p.sp;
      if (p.t >= 1) {
        p.on = false; p.s.visible = false;
        if (p.next === 'post') launch1(pPostOut, p.col, 0.3, null);
        else if (p.next && HORM[p.next]) { const T = TYPES.find((x) => x.id === p.next); const c = T.pos[(rnd() * T.pos.length) | 0]; fx.spawn(c.clone(), V3(0, 0.2, 0), C.set(T.col), 0.6, 0.5, 1.3); if (p.next !== 'prl' || rnd() < 0.35) launch1(pAntOut, HORM[p.next].out, 0.3, null); }
        return;
      }
      p.s.position.copy(p.path.getPoint(p.t)); p.s.scale.setScalar(p.next === null ? 1.3 : 1);
    });
    pomc.visible = sel === 'acth';
    if (pomc.visible) { const c = (t * 0.35) % 1, gap = smooth(0.3, 0.6, c) * (1 - smooth(0.92, 1, c)); pomcSeg.forEach((m, i) => { m.position.x = m.userData.x0 + (i - 1.5) * gap * 0.22; m.position.y = (i === 1 ? 0.06 : 0) * gap; }); }
    Object.entries(MOLS).forEach(([k, m]) => { m.visible = sel === k; m.rotation.y += dt * 0.4; });
  }

  // модель воды: 1 с = 4 ч
  function waterStep(dtd) {
    const D = st.dis, tr = st.treat;
    st.posm = 287 * 42 / st.tbw;
    let adhS = clamp(0.25 * (st.posm - 283), 0, 12);
    if (D === 'dic') adhS = 0; if (D === 'siadh') adhS = Math.max(adhS, 6);
    st.adh += (adhS - st.adh) * Math.min(1, dtd * 30);
    let a = st.adh * (D === 'din' ? 0.04 : 1); if (D === 'dic' && tr) a += 1.1;
    const E = a / (a + 1.5);
    st.uosm = 50 + 1250 * E; if (D === 'din' && tr) st.uosm *= 2; const Uv = 700 / st.uosm;
    st.urine = Uv; st.E = E;
    const drive = Math.max(0, st.posm - 292) * 3;
    const B = clamp(2.2 + 0.3 * (st.posm - 287), 0.6, 2.6);
    st.intake = D === 'thirst' ? (tr ? B + drive : 0) : D === 'siadh' ? (tr ? (st.posm < 285 ? 1.0 : B + drive) : 2.2) : B + drive;
    st.intake = Math.min(st.intake, 22);
    st.tbw = clamp(st.tbw + (st.intake - Uv - 0.8) * dtd, 33, 47);
  }
  function waterUpdate(dt, t) {
    const dtd = dt / 6; for (let i = 0; i < 4; i++) waterStep(dtd / 4);
    st.day += dtd; if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.25) { st.hist.push([st.t, st.posm, st.urine]); if (st.hist.length > 160) st.hist.shift(); }
    const E = st.E || 0;
    // вазопрессин подходит к рецептору
    const sig = st.dis === 'dic' ? (st.treat ? 0.8 : 0) : clamp(st.adh / 4, 0, 1);
    avp.visible = sig > 0.05; const cyc = (t * 0.4) % 1; avp.position.set(-2.4 + 0.6 * Math.cos(t), BY - 1.15 + 0.55 * smooth(0, 0.6, cyc), 0.5); avp.rotation.y += dt;
    const resp = st.dis === 'din' ? 0.05 : sig;
    recM.children.forEach((m) => { if (m.material) m.material.emissiveIntensity = 0.05 + 0.3 * resp * (0.5 + 0.5 * Math.sin(t * 5)); });
    if (rnd() < dt * 5 * resp) { const p = camp2.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.a.set(-2.3 + rand(-0.3, 0.3), BY + 0.5, rand(-0.3, 0.6)); p.s.visible = true; } }
    camp2.forEach((p) => { if (!p.on) return; p.t += dt * 0.7; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.a).lerp(pka2.position, p.t); });
    pka2.material.emissiveIntensity = 0.04 + 0.35 * resp * (0.5 + 0.5 * Math.sin(t * 4));
    // AQP2 к мембране — доля E
    const nOn = Math.round(E * NAQ * 1.1);
    AQ.forEach((q, i) => { const tgt = i < nOn ? 1 : 0; q.k += (tgt - q.k) * Math.min(1, dt * 1.2); q.m.position.copy(q.home).lerp(q.slot, smooth(0, 1, q.k)); q.ves.position.copy(q.m.position); q.ves.material.opacity = 0.35 * (1 - smooth(0.8, 1, q.k)); q.ves.visible = q.k < 0.98; });
    // вода: из просвета через AQP2 → через клетку → AQP3/4 → в кровь
    if (rnd() < dt * 18 * E) { const q = AQ.filter((x) => x.k > 0.95); const p = W.find((x) => !x.on); if (q.length && p) { const s = q[(rnd() * q.length) | 0].slot; p.on = true; p.t = 0; p.s.visible = true; p.path = new THREE.CatmullRomCurve3([s.clone().add(V3(rand(-0.2, 0.2), 0.9, 0)), s.clone(), V3(s.x + rand(-0.4, 0.4), 0, s.z * 0.5), V3(s.x + rand(-0.5, 0.5), BY, rand(-0.6, 0.6)), V3(s.x + rand(-0.6, 0.6), BY - 1.0, -0.2)]); } }
    W.forEach((p) => { if (!p.on) return; p.t += dt * 0.35; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.path.getPoint(p.t)); });
    // поток мочи в просвете: скорость ~ объём
    const flow = clamp(st.urine / 2, 0.15, 6);
    if (rnd() < dt * (3 + flow * 3)) { const p = U.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.y = AY + rand(0.35, 1.3); p.z = rand(-1, 1); p.s.visible = true; } }
    U.forEach((p) => { if (!p.on) return; p.t += dt * 0.12 * flow; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.set(-3.5 + 7 * p.t, p.y, p.z); });
    const uc = C.set('#F2D27A').lerp(new THREE.Color('#FFF6D8'), clamp(1 - (st.uosm - 100) / 900, 0, 1)); U.forEach((p) => p.s.material.color.copy(uc));
    lumen.material.emissive.copy(uc); lumen.material.emissiveIntensity = 0.03 + 0.08 * clamp((st.uosm - 100) / 1000, 0, 1);
  }

  function growthCurve() {
    const D = st.gdis, tr = st.gtreat, out = []; let hgt = 50, acro = 1;
    for (let a = 0; a <= AMAX + 1e-6; a += 0.05) {
      const v = (med(a + 0.05) - med(a)) / 0.05; let f = 1, igf = 100;
      if (D === 'def') { if (a > 1) { f = 0.58; igf = 15; } if (tr && a >= 4) { f = a < 9 ? 1.35 : 1; igf = 100; } }
      if (D === 'giant' && a >= 8) { const on = !(tr && a >= 11); f = on ? 1.5 : 1; igf = on ? 300 : 110; }
      if (D === 'acro' && a >= 20) { const on = !(tr && a >= 22); igf = on ? 350 : 120; }
      let dh = v * f * 0.05; if (D === 'giant' && a >= 18 && a < 22 && !(tr)) dh += 2.5 * 0.05;
      hgt += dh; if (D === 'acro' && a >= 20 && igf > 200) acro = Math.min(1.45, acro + 0.08 * 0.05); if (D === 'acro' && tr && a >= 22) acro -= (acro - 1.08) * 0.4 * 0.05;
      out.push([a, hgt, igf, acro]);
    }
    st.curve = out;
  }
  function growthUpdate(dt, t) {
    if (!st.curve.length) growthCurve();
    if (st.age < AMAX) st.age = Math.min(AMAX, st.age + dt * 1.8); else { st.hold += dt; if (st.hold > 3) { st.age = 0; st.hold = 0; } }
    const r = st.curve[Math.min(st.curve.length - 1, Math.round(st.age / 0.05))]; st.hgt = r[1]; st.igf = r[2]; st.acro = r[3];
    BG.scale.setScalar(st.hgt / 178);
    HANDS.forEach((m) => m.scale.setScalar(st.acro)); jaw.scale.set(st.acro, 0.9 + 0.35 * (st.acro - 1) + 0.1, st.acro);
    const g = clamp(st.igf / 100, 0.1, 3.5), open = st.age < 18 + (st.gdis === 'giant' && !st.gtreat ? 4 : 0);
    A3.gh.mat.uniforms.uOn.value = clamp(0.25 + 0.3 * g, 0.1, 1.3); ['k1', 'k2', 'h1', 'h2'].forEach((k) => { A3[k].mat.uniforms.uOn.value = clamp(0.2 + 0.28 * g, 0.08, 1.2) * (k[0] === 'h' && st.gdis !== 'acro' ? 0.5 : 1); });
    Object.values(A3).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    plateM.forEach((m, i) => { m.visible = open; m.material.color.set(i >= 2 && !open ? '#FF9A5C' : '#7FE0A0'); m.material.opacity = 0.35 + 0.5 * clamp(g / 2, 0, 1) * (0.7 + 0.3 * Math.sin(t * 5 + i)); });
    pitG3.spr.material.opacity = 0.25 + 0.2 * Math.min(g, 3); const tum = (st.gdis === 'giant' && st.age >= 8 && !(st.gtreat && st.age >= 11)) || (st.gdis === 'acro' && st.age >= 20 && !(st.gtreat && st.age >= 22));
    tumor.visible = tum; tumor.scale.setScalar(1 + 0.15 * Math.sin(t * 4));
    if (rnd() < dt * 6 * g && open) { const p = PLATES[(rnd() * 2) | 0]; fx.spawn(IN.localToWorld(p.clone()), V3(0, 0.3, 0.1), C.set('#7FE0A0'), 0.5, 0.6, 0.9); }
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'map') mapUpdate(dt, t);
    if (st.mode === 'water') waterUpdate(dt, t);
    if (st.mode === 'growth') growthUpdate(dt, t);
    G3.updateMatrixWorld(true);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'water') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'osm. (blue) · urine, L/day, log (yellow)', xl: 'time →' });
      const t1 = st.t, X = (tt) => A.X(clamp((tt - (t1 - 40)) / 40, 0, 1)), Yo = (o) => A.Y(clamp((o - 255) / 60, 0, 1)), Yu = (u) => A.Y(clamp(Math.log10(u / 0.3) / Math.log10(70), 0, 1));
      ctx.fillStyle = 'rgba(127,214,255,.10)'; ctx.fillRect(A.X(0), Yo(295), A.X(1) - A.X(0), Yo(280) - Yo(295));
      const line = (fy, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = fy(r); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      line((r) => Yo(r[1]), '#7FD6FF'); line((r) => Yu(r[2]), '#F2D27A');
      return;
    }
    if (st.mode === 'growth') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'height, cm (gray — normal)', xl: 'age, 0–25 years' });
      const X = (a) => A.X(a / AMAX), Y = (v) => A.Y(clamp((v - 40) / 190, 0, 1));
      ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.beginPath(); for (let a = 0; a <= AMAX; a += 0.5) ctx.lineTo(X(a), Y(med(a) * 1.08)); for (let a = AMAX; a >= 0; a -= 0.5) ctx.lineTo(X(a), Y(med(a) * 0.92)); ctx.fill();
      ctx.strokeStyle = '#7FE0A0'; ctx.lineWidth = 2; ctx.beginPath(); st.curve.forEach(([a, v], i) => { if (a > st.age) return; i ? ctx.lineTo(X(a), Y(v)) : ctx.moveTo(X(a), Y(v)); }); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; [100, 150, 200].forEach((v) => ctx.fillText(String(v), A.X(0) + 3, Y(v) - 2));
      return;
    }
    scopeShow(false);
  }

  const SEL = { all: 'All', gh: 'GH', prl: 'Prolactin', acth: 'ACTH', tsh: 'TSH', gn: 'LH and FSH', adh: 'Vasopressin', oxt: 'Oxytocin' };
  const SELTXT = {
    all: 'The <b>pituitary</b> is a pea-sized gland in the bony “Turkish saddle” (sella turcica) under the brain; the hypothalamus controls it. The <b>anterior lobe</b> (adenohypophysis) is a true gland: five cell types make six hormones. They are driven by <b>releasing hormones</b> (switch on) and <b>inhibiting hormones</b> (switch off), which small neurons of the arcuate, paraventricular and other hypothalamic nuclei release in the <b>median eminence</b>; short <b>portal vessels</b> carry them straight to the anterior-lobe cells. The <b>posterior lobe</b> (neurohypophysis) makes no hormones of its own: vasopressin and oxytocin are made by large neurons of the supraoptic and paraventricular nuclei, travel down their axons and wait in the terminals for a signal. Choose a hormone.',
    gh: '<b>Growth hormone</b> (GH, somatotropin) is a protein of 191 amino acids made by somatotrophs, almost half of the anterior-lobe cells. <b>GHRH</b> switches it on, <b>somatostatin</b> switches it off, and ghrelin from the stomach also stimulates it. It is released in pulses, mostly during deep sleep. GH itself raises blood sugar and boosts fat breakdown (it is counter-regulatory to insulin), while bone growth runs through a messenger — IGF-1 from the liver. More in the “Growth hormone” mode.',
    prl: '<b>Prolactin</b> starts and maintains milk production. It is the only anterior-lobe hormone that the hypothalamus mainly <b>inhibits</b>: <b>dopamine</b> (red stream, molecule on the right) keeps lactotrophs “on the brake” — so lactotrophs glow but release little. If a tumor compresses the pituitary stalk or drugs block dopamine (antipsychotics, metoclopramide), prolactin rises. <b>Prolactinoma</b> is the commonest hormone-secreting pituitary tumor: in women it disrupts the cycle and causes galactorrhea (milk leakage), in men it lowers libido. It is treated with dopamine agonists (cabergoline), and the tumor often shrinks without surgery.',
    acth: 'Corticotrophs make a large precursor protein, <b>pro-opiomelanocortin</b> (POMC, on the right). Convertase enzymes cut it into pieces: <b>ACTH</b> (drives the adrenal cortex — cortisol), <b>melanocyte-stimulating hormones</b> (MSH, skin pigmentation) and <b>β-endorphin</b> (the body’s own opioid). They are switched on by <b>CRH</b> from the paraventricular nucleus (together with vasopressin in stress); cortisol feeds back to inhibit both the hypothalamus and the pituitary. In Addison’s disease ACTH is very high and the skin darkens: the start of the ACTH molecule matches α-MSH, and excess ACTH itself acts on MSH receptors (MC1R) in melanocytes. A corticotroph adenoma causes Cushing’s disease. See the “Adrenal glands: steroids and stress” topic.',
    tsh: '<b>Thyroid-stimulating hormone</b> (TSH) is a glycoprotein of two subunits: α is the same as in LH, FSH and hCG, β is its own. It is switched on by <b>TRH</b> (just three amino acids, molecule on the right; made by small neurons of the paraventricular nucleus) and switched off by somatostatin and the thyroid hormones themselves. TSH is the most sensitive test of thyroid function. See the “Thyroid hormones” topic.',
    gn: 'Gonadotrophs make <b>luteinizing</b> (LH) and <b>follicle-stimulating</b> (FSH) hormones. They are switched on by <b>GnRH</b>, but only when it arrives in <b>pulses</b> — about once every 1–2 hours (see the flashes of the stream). Continuous GnRH, by contrast, shuts gonadotrophs down within a couple of weeks — this is how GnRH analogs treat prostate cancer. In men LH drives testosterone synthesis and FSH sperm maturation; in women they drive follicle maturation and ovulation. See the “Sex hormones and pregnancy” topic.',
    adh: '<b>Vasopressin</b> (antidiuretic hormone, ADH) is a 9-amino-acid peptide with a disulfide bridge (molecule on the right). It is made by neurons of the supraoptic (mostly) and paraventricular nuclei; granules travel down the axons into the posterior lobe. The release signals are a rise in blood osmolality (osmoreceptors sense a 1–2% shift) and a large fall in blood pressure or volume. In the kidney, via the <b>V2 receptor</b>, it inserts water channels — aquaporins — and urine becomes concentrated (the “Vasopressin and water” mode); via the V1 receptor it constricts vessels. Alcohol inhibits vasopressin release — hence frequent urination.',
    oxt: '<b>Oxytocin</b> is also a nonapeptide; it differs from vasopressin by two amino acids (molecule on the right). It is made mainly in the paraventricular nucleus. It is released reflexly: when the cervix is stretched in labor (contractions boost release, release boosts contractions — positive feedback) and during breastfeeding, when milk is squeezed out of the alveoli (the “let-down reflex”). Synthetic oxytocin is given to induce labor and to stop bleeding after birth. In the brain it takes part in attachment and trust.',
  };
  const DIS = { norm: 'Normal', thirst: 'No water', dic: 'Central diabetes insipidus', din: 'Nephrogenic diabetes insipidus', siadh: 'SIADH' };
  const DISTXT = {
    norm: 'A <b>collecting duct</b> cell of the kidney. Above is the tubule lumen (future urine), below is blood. Vasopressin binds the <b>V2 receptor</b>, cAMP rises via the G protein, <b>protein kinase A</b> phosphorylates <b>aquaporin-2</b> (blue), and vesicles carrying it fuse with the urine-side membrane. Water follows the osmotic gradient from urine through the cell into blood (through the always-open aquaporins 3 and 4, green) — urine becomes concentrated. Without vasopressin aquaporins return inside the cell, the membrane becomes water-tight and urine is dilute. Normally there are 1–2 L of urine a day (1 second = 4 hours).',
    thirst: 'A person <b>without access to water</b>. Water is lost with breath, sweat and urine, blood becomes more concentrated and osmolality rises — the hypothalamus switches on <b>thirst</b> and vasopressin release. All aquaporins are in the membrane, urine is under a liter a day, dark and concentrated (up to 1200 mOsm/kg — four times more concentrated than blood). The kidneys can only save water — it can be replaced only by drinking.',
    dic: '<b>Central diabetes insipidus</b>: there is no vasopressin (injury or tumor near the pituitary, surgery, sometimes autoimmune damage). Aquaporins are not inserted, and the kidney excretes up to 15–20 liters of dilute urine a day. The person is constantly thirsty: drinking freely keeps blood sodium near the upper limit of normal; without access to water they dehydrate quickly.',
    din: '<b>Nephrogenic diabetes insipidus</b>: there is plenty of vasopressin, but the kidney does not hear it — a mutation of the V2 receptor (X-linked) or aquaporin-2, or a drug side effect (lithium salts). Blood hormone levels are high, yet there are no aquaporins in the membrane. Desmopressin does not help.',
    siadh: '<b>Syndrome of inappropriate ADH secretion</b> (SIADH): vasopressin is released without need — with tumors (especially small-cell lung cancer), lung and brain disease, and some drugs. The kidney retains water and blood is diluted: osmolality and sodium fall (<b>hyponatremia</b>), while urine stays concentrated. Severe hyponatremia causes brain swelling: headache, confusion, seizures.',
  };
  const TREAT = { thirst: 'Drink water', dic: 'Desmopressin', din: 'Thiazide', siadh: 'Restrict fluids' };
  const TREATTXT = {
    thirst: 'The person drinks — osmolality returns to normal, vasopressin falls, some aquaporins leave the membrane, and the kidneys excrete the extra water.',
    dic: '<b>Desmopressin</b> is a synthetic vasopressin analog: it acts only on the V2 receptor (hardly constricts vessels) and lasts longer. Tablets or a nasal spray bring aquaporins back into the membrane — urine is again about 1–1.5 liters. No more drinking than usual is needed.',
    din: '<b>Thiazide diuretics</b> paradoxically reduce urine volume: a small sodium loss increases salt and water reabsorption in the proximal tubule, so less fluid reaches the collecting ducts. Together with a low-salt, low-protein diet, urine volume roughly halves, but does not return to normal.',
    siadh: '<b>Treating SIADH</b>: restrict fluids to 0.8–1 L a day and treat the cause; in severe cases — vaptans (V2 receptor blockers) and careful infusion of <b>hypertonic (3%)</b> NaCl (ordinary saline can even worsen hyponatremia). Sodium is raised no faster than 8–10 mmol/L per day — otherwise osmotic demyelination occurs in the brain.',
  };
  const GDIS = { norm: 'Normal', def: 'GH deficiency', giant: 'Gigantism', acro: 'Acromegaly' };
  const GTREAT = { def: 'Growth hormone from age 4', giant: 'Surgery at 11', acro: 'Surgery at 22' };
  const GTXT = {
    norm: '<b>Growth hormone</b> is released in pulses — mostly at night, in deep sleep, and in adolescence. On its own it raises blood sugar and burns fat, while it tells bones to grow mainly through a messenger — <b>insulin-like growth factor 1</b> (IGF-1), made in response to GH by the liver (and the tissues themselves). IGF-1 makes cartilage cells divide in the <b>growth plates</b> at the ends of long bones (glowing). By 16–18 years, under sex hormones, the plates close — after that a person no longer grows taller. Time advances on its own; the height chart is in the corner.',
    def: '<b>Growth hormone deficiency</b> in a child (congenital or after a tumor or radiotherapy): up to one year the child grows almost normally, then growth velocity halves while body proportions are preserved. Untreated adult height is about 130–140 cm. Intelligence is not affected (unlike congenital hypothyroidism).',
    giant: '<b>Gigantism</b>: a somatotroph adenoma appeared in childhood (here at age 8), while the growth plates were open. IGF-1 is three times above normal, bones grow in length, height exceeds 2 meters, and the plates close later than usual. The tumor may press on the optic chiasm — the bitemporal (outer) visual fields are lost.',
    acro: '<b>Acromegaly</b>: the adenoma appeared in an adult (here at 20), when the growth plates were already closed. Bones no longer grow in length, but the hands, feet, lower jaw, nose, tongue and internal organs thicken and enlarge. The disease progresses slowly and is often noticed after 5–10 years — when rings and shoes no longer fit. It is dangerous because of diabetes, hypertension and heart disease.',
  };
  const GTREATTXT = {
    def: '<b>Recombinant growth hormone</b> — daily injections until the growth plates close. Treatment started at age 4: the child “catches up” with peers and reaches almost normal height. Growth hormone used to be extracted from the pituitaries of the deceased — until it turned out that this transmits the prion Creutzfeldt–Jakob disease; since 1985 only the genetically engineered hormone is used.',
    giant: '<b>Treatment</b>: removal of the adenoma through the nose (transsphenoidal surgery), somatostatin analogs (octreotide, lanreotide) or the GH receptor blocker pegvisomant. After surgery at 11, IGF-1 normalizes and the child then grows at the usual rate.',
    acro: '<b>Treating acromegaly</b> is the same as gigantism: surgery, octreotide, pegvisomant. After surgery at 22, IGF-1 normalizes, soft-tissue growth stops and partly reverses, but the bone changes remain.',
  };

  const L1 = () => st.labels && st.mode === 'map', L2 = () => st.labels && st.mode === 'water', L3 = () => st.labels && st.mode === 'growth';
  const w3 = (p) => () => IN.localToWorld(p.clone());
  const labels = [
    { text: 'hypothalamus', pos: V3(-1.2, 3.25, 0.4), color: '#C8B8FF', show: L1 },
    { text: 'supraoptic nucleus', pos: SON.clone().add(V3(0.75, 0.2, 0.2)), color: '#7FD6FF', show: L1 },
    { text: 'paraventricular nucleus', pos: PVN.clone().add(V3(-0.4, 0.28, 0.2)), color: '#7FE0A0', show: L1 },
    { text: 'arcuate nucleus (GHRH, dopamine)', pos: ARC.clone().add(V3(-1.3, -0.12, 0.2)), color: '#F2C14E', show: L1 },
    { text: 'portal vessels', pos: V3(0.95, 0.35, 0.3), color: '#D84A50', show: L1 },
    { text: 'stalk', pos: V3(-0.42, 0.55, 0.2), color: '#E8C0D0', show: L1 },
    { text: 'anterior lobe', pos: P_ANT.clone().add(V3(0.6, -0.72, 0.4)), color: '#E890A0', show: L1 },
    { text: 'posterior lobe', pos: P_POST.clone().add(V3(-0.75, 0.3, 0.3)), color: '#C8B8F0', show: L1 },
    { text: 'sella turcica', pos: V3(-1.55, -1.55, 0.1), color: '#E8DCC0', show: L1 },
    { text: 'optic chiasm', pos: V3(1.75, 1.55, 0.4), color: '#E8E0C8', show: L1 },
    { text: 'into blood', pos: V3(2.5, -2.35, 0.1), color: '#9FA8FF', show: L1 },
    { text: 'into blood', pos: V3(-2.15, -2.35, 0.1), color: '#9FA8FF', show: L1 },
    { text: 'POMC → γ-MSH · ACTH · γ-LPH · β-endorphin', pos: V3(2.35, 0.05, 0.4), color: '#F2C14E', show: () => L1() && st.sel === 'acth' },
    { text: 'TRH', pos: V3(2.65, 1.35, 0.3), color: '#7FD6FF', show: () => L1() && st.sel === 'tsh' },
    { text: 'dopamine (inhibits)', pos: V3(2.65, 1.35, 0.3), color: '#FF6A5A', show: () => L1() && st.sel === 'prl' },
    { text: 'vasopressin', pos: V3(2.65, 1.45, 0.3), color: '#5B8CFF', show: () => L1() && st.sel === 'adh' },
    { text: 'oxytocin', pos: V3(2.65, 1.45, 0.3), color: '#FF9AE0', show: () => L1() && st.sel === 'oxt' },
    { text: 'urine (tubule lumen)', pos: V3(40 - 2.6, AY + 1.25, 0.5), color: '#F2D27A', show: L2 },
    { text: 'blood', pos: V3(40 - 3.1, BY - 1.5, 0.4), color: '#FF6A5A', show: L2 },
    { text: 'V2 receptor', pos: V3(40 - 3.3, BY - 0.25, 0.8), color: '#FF8A5C', show: L2 },
    { text: 'G protein', pos: V3(40 - 3.4, BY + 0.8, 0.8), color: '#8FB8A8', show: L2 },
    { text: 'vasopressin', pos: V3(40 - 1.6, BY - 1.25, 0.8), color: '#5B8CFF', show: () => L2() && avp.visible },
    { text: 'protein kinase A', pos: V3(40 - 0.9, 0.4, 0.6), color: '#C77DFF', show: L2 },
    { text: 'aquaporin-2', pos: V3(40 + 0.4, AY + 0.45, 0.9), color: '#7FD6FF', show: L2 },
    { text: 'AQP3/4', pos: V3(40 + 1.6, BY + 0.4, 0.9), color: '#7FE0A0', show: L2 },
    { text: 'nucleus', pos: V3(40 + 2.6, 0.55, 0.2), color: '#9F7BFF', show: L2 },
    { text: 'pituitary (GH)', pos: w3(PIT3.clone().add(V3(0.55, 0.15, 0.1))), color: '#9F7BFF', show: L3 },
    { text: 'liver (IGF-1)', pos: w3(LIV3.clone().add(V3(-0.75, -0.2, 0.2))), color: '#E07A5A', show: L3 },
    { text: 'growth plates', pos: w3(PLATES[0].clone().add(V3(0.75, 0.1, 0.1))), color: '#7FE0A0', show: () => L3() && plateM[0].visible },
    { text: 'adenoma', pos: w3(PIT3.clone().add(V3(-0.55, 0.15, 0.1))), color: '#FF5A5A', show: () => L3() && tumor.visible },
    { text: 'hands, jaw', pos: w3(HANDS[0].position.clone().add(V3(0.3, -0.5, 0.1))), color: '#E2B0A0', show: () => L3() && st.gdis === 'acro' },
    ...[50, 100, 150, 200].map((v) => ({ text: `${v} cm`, pos: V3(80 - 2.1, FOOT + v * CM + 0.12, 0), color: '#8A90A8', show: L3 })),
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'map' ? SELTXT[st.sel] : st.mode === 'water' ? (st.treat && st.dis !== 'norm' ? TREATTXT[st.dis] : DISTXT[st.dis]) : (st.gtreat && st.gdis !== 'norm' ? GTREATTXT[st.gdis] : GTXT[st.gdis]);
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'map', label: 'Hypothalamus and pituitary' }, { id: 'water', label: 'Vasopressin and water' }, { id: 'growth', label: 'Growth hormone' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'map') box.append(h('div', { class: 'glabel' }, 'Hormone'), h('div', { class: 'gctl' }, seg(Object.entries(SEL).map(([id, label]) => ({ id, label })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
      else if (st.mode === 'water') { const tb = toggle(TREAT[st.dis] || 'Treatment', () => st.treat, (v) => { st.treat = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'State'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; st.treat = false; st.day = 0; refs.rebuild(); refs.setInfo(); }), st.dis !== 'norm' ? tb : null, button('Restart', () => { st.tbw = 42; st.adh = 1; st.day = 0; st.hist = []; }))); }
      else { const tb = toggle(GTREAT[st.gdis] || 'Treatment', () => st.gtreat, (v) => { st.gtreat = v; growthCurve(); st.age = 0; st.hold = 0; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Child'), h('div', { class: 'gctl' }, seg(Object.entries(GDIS).map(([id, label]) => ({ id, label })), () => st.gdis, (v) => { st.gdis = v; st.gtreat = false; growthCurve(); st.age = 0; st.hold = 0; refs.rebuild(); refs.setInfo(); }), st.gdis !== 'norm' ? tb : null, button('Restart', () => { st.age = 0; st.hold = 0; }))); }
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['map', 'water', 'growth'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'water') return [['Na⁺', Math.round(st.posm / 2 - 5.5), 'mmol/L'], ['Urine', f1(st.urine), 'L/day'], ['Urine', Math.round(st.uosm), 'mOsm/kg'], ['Elapsed', Math.floor(st.day), 'days']];
    if (st.mode === 'growth') return [['Age', Math.floor(st.age), 'years'], ['Height', Math.round(st.hgt), 'cm'], ['IGF-1', Math.round(st.igf), '% of normal']];
    const SH = { all: ['Cell types', 5, ''], gh: ['Anterior-lobe cells', '≈ 50', '%'], prl: ['Anterior-lobe cells', '15–20', '%'], acth: ['Anterior-lobe cells', '15–20', '%'], tsh: ['Anterior-lobe cells', '≈ 5', '%'], gn: ['Anterior-lobe cells', '≈ 10', '%'], adh: ['Made in', 'hypothalamus', ''], oxt: ['Made in', 'hypothalamus', ''] };
    return [SH[st.sel]];
  }
  const upd0 = update;
  const self = {
    mobZoom: 0.6, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope, accent: '#9F7BFF',
    kicker: 'Biochemistry · hormones', title: 'Hypothalamus and pituitary',
    lede: 'A patch of brain the size of a fingernail and a pea-sized gland control growth, water, stress, metabolism, reproduction and milk.',
    notes: `
      <div><h2>The hypothalamic–pituitary system</h2>
        <p>The hypothalamus links the nervous system to the endocrine system. Its parvocellular neurons release <b>releasing</b> and <b>inhibiting hormones</b> into the portal system: thyrotropin-releasing hormone (TRH), corticotropin-releasing hormone (CRH), gonadotropin-releasing hormone (GnRH), growth hormone–releasing hormone (GHRH), somatostatin and dopamine (prolactin-inhibiting factor). Magnocellular neurons of the supraoptic and paraventricular nuclei synthesize <b>vasopressin</b> and <b>oxytocin</b> together with neurophysin proteins; the hormones are stored in axon terminals in the posterior lobe.</p>
        <h3>Anterior-lobe hormones</h3><ul><li><b>Proteins and peptides</b>: GH (191 amino acids), prolactin (199), ACTH (39) — from pro-opiomelanocortin together with MSH and β-endorphin.</li><li><b>Glycoproteins</b> of α and β subunits: TSH, LH, FSH (the α subunit is also shared with human chorionic gonadotropin).</li><li>Feedback: target-gland hormones (cortisol, T₄, sex steroids) and IGF-1 inhibit the hypothalamus and pituitary.</li></ul>
        <h3>Mechanism of action</h3><p>TSH, LH, FSH, ACTH, vasopressin (V2) — G protein–coupled receptors (cAMP); vasopressin (V1) and oxytocin — via phospholipase C and Ca²⁺; GH and prolactin — receptors coupled to JAK tyrosine kinases.</p>
        <h3>Diseases</h3><ul><li>Pituitary adenomas: prolactinoma, somatotropinoma (gigantism, acromegaly), corticotropinoma (Cushing’s disease); large tumors compress the optic chiasm.</li><li>Hypopituitarism (for example, after childbirth with heavy blood loss — Sheehan syndrome).</li><li>Diabetes insipidus (central, nephrogenic), syndrome of inappropriate ADH secretion.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The hypothalamus, pituitary and kidney cell are diagrams, not to scale; the number of anterior-lobe cells is arbitrary, the ratio of types approximate.</li><li>Vasopressin, oxytocin, TRH and dopamine molecules are built from their chemical formulas. The V2 receptor is shown with the structure of another receptor of the same family (β2-adrenergic receptor with G protein, PDB 3SN6).</li><li>The water and growth models are simplified; time is accelerated, the growth curve is the median for boys.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('map'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
export { makePituitary };
