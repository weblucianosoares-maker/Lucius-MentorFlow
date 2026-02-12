const fs = require('fs');
const path = 'constants.ts';
try {
    let content = fs.readFileSync(path, 'utf8');

    // Define replacements
    const replacements = [
        { target: 'Como você atrai seus clientes hoje? (Ex: Orgânico, Tráfego Pago, Indicação...)', replace: 'Como você atrai seus clientes hoje? (((Ex: Orgânico, Tráfego Pago, Indicação...)))' },
        { target: '(Se for zero, digite 0).', replace: '(((Se for zero, digite 0)))' },
        { target: '(Ex: Planilhas, CRM, Caderno...)', replace: '(((Ex: Planilhas, CRM, Caderno...)))' },
        { target: '(Ex: Zoom, WhatsApp, Lançamento...)', replace: '(((Ex: Zoom, WhatsApp, Lançamento...)))' },
        { target: '(Ex: Sim ou Não)', replace: '(((Ex: Sim ou Não)))' },
        { target: '(Ex: R$ 50.000,00)', replace: '(((Ex: R$ 50.000,00)))' },
        { target: '(Ex: R$ 3.000,00)', replace: '(((Ex: R$ 3.000,00)))' },
        { target: '(Ex: R$ 200.000,00)', replace: '(((Ex: R$ 200.000,00)))' }
    ];

    let modified = false;
    for (const { target, replace } of replacements) {
        if (content.includes(target)) {
            console.log(`Replacing: ${target.substring(0, 20)}...`);
            content = content.replace(target, replace);
            modified = true;
        } else {
            console.warn(`Target NOT FOUND: ${target}`);
        }
    }

    if (modified) {
        fs.writeFileSync(path, content);
        console.log('Successfully updated constants.ts');
    } else {
        console.log('No changes made to constants.ts');
    }
} catch (err) {
    console.error('Error updating constants.ts:', err);
}
