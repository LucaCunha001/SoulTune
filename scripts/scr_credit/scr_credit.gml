function scr_credit(arg0, arg1, arg2 = 1) constructor {
	header = arg0;
	text_line = arg1;
	columns = arg2;
}

function generate_credits() {
	var credits = [];

	// ORIGINAL
	credits[0] = [
		new scr_credit(
			[ scr_gettext("obj_credits_original_title0") ],
			[ scr_gettext("obj_credits_original_item0_0") ]
		)
	];

	// MÚSICAS
	credits[1] = [
		new scr_credit(
			[ scr_gettext("obj_credits_music_title0"), scr_gettext("obj_credits_music_title1") ],
			[ scr_gettext("obj_credits_music_item1_0") ]
		),
		new scr_credit(
			[ scr_gettext("obj_credits_music_title2") ],
			[ scr_gettext("obj_credits_music_item2_0"), scr_gettext("obj_credits_music_item2_1") ]
		)
	];

	// DESENHOS
	credits[2] = [
		new scr_credit(
			[ scr_gettext("obj_credits_drawing_title0"), scr_gettext("obj_credits_drawing_title1") ],
			[ scr_gettext("obj_credits_drawing_item1_0") ]
		)
	];

	// DEV
	credits[3] = [
		new scr_credit(
			[ scr_gettext("obj_credits_dev_title0") ],
			[ scr_gettext("obj_credits_dev_item0_0") ]
		)
	];

	// TRADUÇÕES
	credits[4] = [
		new scr_credit(
			[ scr_gettext("obj_credits_traducoes_title0") ],
			[ scr_gettext("obj_credits_traducoes_item0_0") ]
		)
	]

	// VOZES
	credits[5] = [
		new scr_credit(
			[ scr_gettext("obj_credits_vocals_title0") ],
			[ scr_gettext("obj_credits_vocals_item0_0"), scr_gettext("obj_credits_vocals_item0_1") ]
		)
	];

	// SONS E FONTES
	credits[6] = [
		new scr_credit(
			[ scr_gettext("obj_credits_sfx_title0") ],
			[ scr_gettext("obj_credits_sfx_item0_0") ]
		),
		new scr_credit(
			[ scr_gettext("obj_credits_sfx_title1") ],
			[ scr_gettext("obj_credits_sfx_item1_0") ]
		)
	];

	// PROGRAMAS
	credits[7] = [
		new scr_credit(
			[ scr_gettext("obj_credits_programs_title0") ],
			[
				scr_gettext("obj_credits_programs_item0_0"),
				scr_gettext("obj_credits_programs_item0_1"),
				scr_gettext("obj_credits_programs_item0_2")
			]
		)
	];

	credits[8] = [
		new scr_credit(
			[ scr_gettext("obj_credits_programs_title0") ],
			[
				scr_gettext("obj_credits_programs2_item0_0"),
				scr_gettext("obj_credits_programs2_item0_1"),
				scr_gettext("obj_credits_programs2_item0_2")
			]
		)
	];

	// ASGORE
	credits[9] = [
		new scr_credit(
			[ scr_gettext("obj_credits_asgore_title0") ],
			[
			  scr_gettext("obj_credits_asgore_item2_0") ]
		),
		new scr_credit(
			[ scr_gettext("obj_credits_asgore_title1") ],
			[ scr_gettext("obj_credits_asgore_item1_0") ]
		),
		new scr_credit(
			[ scr_gettext("obj_credits_asgore_title2") ],
			[ scr_gettext("obj_credits_asgore_item2_1")]
		)
	];

	credits[10] = [
		new scr_credit(
			[ scr_gettext("obj_credits_asgore_title0"), scr_gettext("obj_credits_asgore_title2") ],
			[
				scr_gettext("obj_credits_asgore2_item1_0"),
				scr_gettext("obj_credits_asgore2_item1_1"),
				scr_gettext("obj_credits_asgore2_item1_2")
			]
		)
	];

	credits[11] = [
		new scr_credit(
			[ scr_gettext("obj_credits_beta_testers_title0") ],
			[
				scr_gettext("obj_credits_beta_testers_item0_0"),
				scr_gettext("obj_credits_beta_testers_item0_1"),
				scr_gettext("obj_credits_beta_testers_item0_2"),
				scr_gettext("obj_credits_beta_testers_item0_3"),
				scr_gettext("obj_credits_beta_testers_item0_4"),
				scr_gettext("obj_credits_beta_testers_item0_5")
			],
			2
		)
	]

	// AGRADECIMENTOS
	credits[12] = [
		new scr_credit(
			[ scr_gettext("obj_credits_thanks_title0") ],
			[
				scr_gettext("obj_credits_thanks_item0_1"),
				scr_gettext("obj_credits_thanks_item0_0"),
				scr_gettext("obj_credits_thanks_item0_3"),
				scr_gettext("obj_credits_thanks_item0_2"),
				scr_gettext("obj_credits_thanks_item0_5"),
				scr_gettext("obj_credits_thanks_item0_4")
			],
			2
		)
	];

	credits[13] = [
		new scr_credit(
			[ scr_gettext("obj_credits_thanks_title0") ],
			[
				scr_gettext("obj_credits_thanks2_item0_1"),
				scr_gettext("obj_credits_thanks2_item0_0"),
				scr_gettext("obj_credits_thanks2_item0_3"),
				scr_gettext("obj_credits_thanks2_item0_2"),
				scr_gettext("obj_credits_thanks2_item0_5"),
				scr_gettext("obj_credits_thanks2_item0_4")
			],
			2
		)
	];

	return credits;
}